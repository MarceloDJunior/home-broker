package main

import (
	"encoding/json"
	"fmt"
	"sync"

	"github.com/MarceloDJunior/home-broker/broker-service/internal/infra/kafka"
	"github.com/MarceloDJunior/home-broker/broker-service/internal/market/dto"
	"github.com/MarceloDJunior/home-broker/broker-service/internal/market/entity"
	"github.com/MarceloDJunior/home-broker/broker-service/internal/market/transformer"
	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
)

func main() {
	// create a channel to orders in, a channel to orders out, a channel to kafka messages and a wait group
	ordersIn := make(chan *entity.Order)
	ordersOut := make(chan *entity.Order)
	wg := &sync.WaitGroup{}
	defer wg.Wait()

	kafkaMsgChan := make(chan *ckafka.Message)
	// create kafka config map (variable to connect in kafka)
	configMap := &ckafka.ConfigMap{
		"bootstrap.servers": "host.docker.internal:9094",
		"group.id":          "home-broker",
		"auto.offset.reset": "latest",
	}
	// create a new producer from infra kafka code
	producer := kafka.NewKafkaProducer(configMap)
	// create a new consumer from infra kafka code reading input topic
	kafka := kafka.NewConsumer(configMap, []string{"input"})

	// go to create a goroutine, a second thread consuming from kafka
	go kafka.Consume(kafkaMsgChan) // T2

	// create a new book with the channels
	book := entity.NewBook(ordersIn, ordersOut, wg)
	// run trade function from book created - third thread
	go book.Trade() // T3

	// fourth thread read the kafka message channel, add an wait group, print message, get the input
	// tranform and put on ordersin channel
	go kafkaMessageListener(kafkaMsgChan, ordersIn, wg)

	// read the orders out channel (book put message in when trade match) transform in a dto and publish on kafka
	for res := range ordersOut {
		output := transformer.TransformOutput(res)
		// serialized json
		outputJson, err := json.MarshalIndent(output, "", "  ")
		fmt.Println(string(outputJson))
		if err != nil {
			fmt.Println(err)
		}
		producer.Publish(outputJson, []byte("orders"), "output")
	}
}

func kafkaMessageListener(kafkaMsgChan chan *ckafka.Message, ordersIn chan *entity.Order, wg *sync.WaitGroup) {
	for msg := range kafkaMsgChan {
		wg.Add(1)

		fmt.Println(string(msg.Value))
		tradeInput := dto.TradeInput{}
		// deserialized json
		err := json.Unmarshal(msg.Value, &tradeInput)
		if err != nil {
			panic(err)
		}
		order := transformer.TransformInput(tradeInput)
		// Same channel book are using
		ordersIn <- order
	}
}
