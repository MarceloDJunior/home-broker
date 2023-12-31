package entity

import (
	"container/heap"
	"sync"
)

type Book struct {
	Orders        []*Order
	Transactions  []*Transaction
	OrdersChan    chan *Order
	OrdersChanOut chan *Order
	Wg            *sync.WaitGroup
}

func NewBook(orderChan chan *Order, orderChanOut chan *Order, wg *sync.WaitGroup) *Book {
	return &Book{
		Orders:        []*Order{},
		Transactions:  []*Transaction{},
		OrdersChan:    orderChan,
		OrdersChanOut: orderChanOut,
		Wg:            wg,
	}
}

func (book *Book) Trade() {
	buyOrders := make(map[string]*OrderQueue)
	sellOrders := make(map[string]*OrderQueue)

	for order := range book.OrdersChan {
		asset := order.Asset.ID

		if buyOrders[asset] == nil {
			buyOrders[asset] = NewOrderQueue() // A new queue for each type of asset
			heap.Init(buyOrders[asset])
		}

		if sellOrders[asset] == nil {
			sellOrders[asset] = NewOrderQueue() // A new queue for each type of asset
			heap.Init(sellOrders[asset])
		}

		if order.OrderType == "BUY" {
			buyOrders[asset].Push(order)
			if sellOrders[asset].Len() > 0 && sellOrders[asset].Orders[0].Price <= order.Price {
				sellOrder := sellOrders[asset].Pop().(*Order)
				if sellOrder.PendingShares > 0 {
					transaction := NewTransaction(sellOrder, order, order.Shares, sellOrder.Price)
					book.AddTransaction(transaction, book.Wg)
					sellOrder.Transactions = append(sellOrder.Transactions, transaction)
					order.Transactions = append(order.Transactions, transaction)
					book.OrdersChanOut <- sellOrder
					book.OrdersChanOut <- order
					sellOrders[asset].Push(sellOrder)
				}
			}
		} else if order.OrderType == "SELL" {
			sellOrders[asset].Push(order)
			if buyOrders[asset].Len() > 0 && buyOrders[asset].Orders[0].Price >= order.Price {
				buyOrder := buyOrders[asset].Pop().(*Order)
				if buyOrder.PendingShares > 0 {
					transaction := NewTransaction(order, buyOrder, order.Shares, buyOrder.Price)
					book.AddTransaction(transaction, book.Wg)
					buyOrder.Transactions = append(buyOrder.Transactions, transaction)
					order.Transactions = append(order.Transactions, transaction)
					book.OrdersChanOut <- buyOrder
					book.OrdersChanOut <- order
					buyOrders[asset].Push(buyOrder)
				}
			}
		}
	}
}

func (book *Book) AddTransaction(transaction *Transaction, wg *sync.WaitGroup) {
	defer wg.Done()

	sellingShares := transaction.SellingOrder.PendingShares
	buyingShares := transaction.BuyingOrder.PendingShares

	minShares := sellingShares
	if buyingShares < minShares {
		minShares = buyingShares
	}

	transaction.SellingOrder.Investor.UpdateAssetPosition(transaction.SellingOrder.Asset.ID, -minShares)
	transaction.AddSellOrderPendingShares(-minShares)

	transaction.BuyingOrder.Investor.UpdateAssetPosition(transaction.BuyingOrder.Asset.ID, minShares)
	transaction.AddBuyOrderPendingShares(-minShares)

	transaction.CalculateTotal(transaction.BuyingOrder.Price)

	transaction.CloseBuyOrder()
	transaction.CloseSellOrder()

	book.Transactions = append(book.Transactions, transaction)
}
