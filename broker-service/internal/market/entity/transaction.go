package entity

import (
	"time"

	"github.com/google/uuid"
)

type Transaction struct {
	ID           string
	SellingOrder *Order
	BuyingOrder  *Order
	Shares       int
	Price        float64
	Total        float64
	Datetime     time.Time
}

func NewTransaction(sellingOrder *Order, BuyingOrder *Order, shares int, price float64) *Transaction {
	total := float64(shares) * price
	return &Transaction{
		ID:           uuid.New().String(),
		SellingOrder: sellingOrder,
		BuyingOrder:  BuyingOrder,
		Shares:       shares,
		Price:        price,
		Total:        total,
		Datetime:     time.Now(),
	}
}

func (t *Transaction) CalculateTotal(price float64) {
	t.Total = float64(t.Shares) * price
}

func (t *Transaction) CloseBuyOrder() {
	if t.BuyingOrder.PendingShares == 0 {
		t.BuyingOrder.Status = "CLOSED"
	}
}

func (t *Transaction) CloseSellOrder() {
	if t.SellingOrder.PendingShares == 0 {
		t.SellingOrder.Status = "CLOSED"
	}
}

func (t *Transaction) AddBuyOrderPendingShares(shares int) {
	t.BuyingOrder.PendingShares += shares
}

func (t *Transaction) AddSellOrderPendingShares(shares int) {
	t.SellingOrder.PendingShares += shares
}
