package processor

import (
	"fmt"
	"log"
	"mini-attendance/worker/model"
	"mini-attendance/worker/repository"
	"time"
)

type AttendanceProcessor struct {
	attendanceRepo repository.AttendanceRepository
	summaryRepo    repository.SummaryRepository
}

func NewAttendanceProcessor(a repository.AttendanceRepository, s repository.SummaryRepository) *AttendanceProcessor {
	return &AttendanceProcessor{a, s}
}

func (p *AttendanceProcessor) ProcessEvent(evt model.AttendanceEvent) {
	fmt.Println("Processing event:", evt.Type)
	switch evt.Type {
	case "checkin":
		p.handleCheckIn(evt)
	case "checkout":
		p.handleCheckOut(evt)
	}
}

func (p *AttendanceProcessor) handleCheckIn(evt model.AttendanceEvent) {
	if err := p.attendanceRepo.SaveCheckIn(evt); err != nil {
		log.Println("check-in save error:", err)
	}
}

func (p *AttendanceProcessor) handleCheckOut(evt model.AttendanceEvent) {
	if err := p.attendanceRepo.SaveCheckOut(evt); err != nil {
		log.Println("check-out save error:", err)
	}

	att, err := p.attendanceRepo.GetByEmployeeAndDate(evt.EmployeeID, evt.Timestamp)
	if err != nil {
		log.Println("summary fetch error:", err)
		return
	}

	// Define rules
	lateLimit := time.Date(att.Date.Year(), att.Date.Month(), att.Date.Day(), 9, 0, 0, 0, time.Local)
	earlyLimit := time.Date(att.Date.Year(), att.Date.Month(), att.Date.Day(), 17, 0, 0, 0, time.Local)

	status := "present"

	if att.CheckIn.After(lateLimit) {
		status = "late"
	} else if att.CheckOut.Before(earlyLimit) {
		status = "early_leave"
	}

	record := model.SummaryRecord{
		EmployeeID: att.EmployeeID,
		Date:       att.Date,
		Status:     status,
	}
	fmt.Println(record)

	if err := p.summaryRepo.UpsertSummary(record); err != nil {
		log.Println("summary update error:", err)
	}
}
