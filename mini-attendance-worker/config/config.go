package config

import "os"

type Config struct {
	RedisUrl   string
	PostgreUrl string
}

func Load() *Config {
	return &Config{
		RedisUrl:   os.Getenv("REDIS_URL"),
		PostgreUrl: os.Getenv("POSTGRE_URL"),
	}
}
