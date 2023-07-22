package kafka

import ckafka "github.com/confluentinc/confluent-kafka-go/kafka"

var producer *ckafka.Producer

type Producer struct {
	ConfigMap *ckafka.ConfigMap
}

func NewKafkaProducer(configMap *ckafka.ConfigMap) *Producer {
	return &Producer{
		ConfigMap: configMap,
	}
}

func (p *Producer) Publish(msg interface{}, key []byte, topic string) error {
	var err error
	if producer == nil {
		producer, err = ckafka.NewProducer(p.ConfigMap)
		if err != nil {
			return err
		}
	}

	message := &ckafka.Message{
		TopicPartition: ckafka.TopicPartition{
			Topic:     &topic,
			Partition: ckafka.PartitionAny,
		},
		Key:   key,
		Value: msg.([]byte),
	}

	err = producer.Produce(message, nil)
	if err != nil {
		return err
	}
	return nil
}
