package consumer

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"mini-attendance/worker/model"
	"mini-attendance/worker/processor"
	"strconv"
	"time"

	"github.com/redis/go-redis/v9"
)

type RedisConsumer struct {
	client    *redis.Client
	processor *processor.AttendanceProcessor
}

func NewRedisConsumer(r *redis.Client, p *processor.AttendanceProcessor) *RedisConsumer {
	return &RedisConsumer{
		client:    r,
		processor: p,
	}
}

type AttendanceEventRaw struct {
	EmployeeID string `json:"employee_id"`
	Type       string `json:"type"`
	Timestamp  string `json:"timestamp"` // epoch millis
}

func (c *RedisConsumer) Start() {
	ctx := context.Background()

	for {
		streams, err := c.client.XRead(ctx, &redis.XReadArgs{
			Streams: []string{"attendance_stream", "$"},
			Count:   1,
			Block:   0,
		}).Result()

		if err != nil {
			log.Println("Redis read error:", err)
			continue
		}

		for _, stream := range streams {
			for _, msg := range stream.Messages {
				var rawEvt AttendanceEventRaw
				jsonBytes, _ := json.Marshal(msg.Values)
				if err := json.Unmarshal(jsonBytes, &rawEvt); err != nil {
					log.Println("Invalid event:", err)
					continue
				}

				tsMillis, err := strconv.ParseInt(rawEvt.Timestamp, 10, 64)
				if err != nil {
					log.Println("Invalid timestamp:", err)
					continue
				}

				evt := model.AttendanceEvent{
					EmployeeID: rawEvt.EmployeeID,
					Type:       rawEvt.Type,
					Timestamp:  time.UnixMilli(tsMillis),
				}
				fmt.Println(evt)

				c.processor.ProcessEvent(evt)
			}
		}
	}
}
