package repository

import (
	"database/sql"
	"mini-attendance/worker/config"

	_ "github.com/lib/pq"
	"github.com/redis/go-redis/v9"
)

func NewPostgres(cfg *config.Config) (*sql.DB, error) {
	return sql.Open("postgres", cfg.PostgreUrl)
}

func NewRedis(cfg *config.Config) *redis.Client {
	return redis.NewClient(&redis.Options{
		Addr: cfg.RedisUrl,
	})
}
