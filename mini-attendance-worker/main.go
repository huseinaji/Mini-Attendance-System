package main

import (
	"fmt"
	"log"
	"mini-attendance/worker/config"
	"mini-attendance/worker/consumer"
	"mini-attendance/worker/processor"
	"mini-attendance/worker/repository"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using system env")
	}

	cfg := config.Load()

	db, err := repository.NewPostgres(cfg)

	if err != nil {
		log.Fatalf("Failed connect Postgres: %v", err)
	}

	redis := repository.NewRedis(cfg)
	fmt.Println("Connected to Postgres and Redis:", db, redis)
	attendanceRepo := repository.NewAttendanceRepo(db)
	summaryRepo := repository.NewSummaryRepo(db)

	processor := processor.NewAttendanceProcessor(attendanceRepo, summaryRepo)
	consumer := consumer.NewRedisConsumer(redis, processor)

	log.Println("Worker running... consuming redis stream")
	consumer.Start()
}
