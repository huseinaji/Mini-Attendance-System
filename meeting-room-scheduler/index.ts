interface Meeting {
    id: number;
    start: string;
    end: string
}

interface ScheduledResult {
    scheduled: number[];
    count: number;
}


function parseMin(timeStr: string) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m; // convert to minutes
}

// Selalu pilih meeting yang selesai paling cepat.
// Supaya sisa waktu ruangan masih bisa diisi meeting lain.
// flow: 
// Ubah jam → menit
// Sort meeting berdasarkan waktu selesai
// Ambil meeting yang start-nya ≥ meeting terakhir yang dipilih
// Ulangi sampai habis

function ScheduledMeeting(meeting: Meeting[]) {
    let parseMeeting = meeting.map((n) => {
        return {
            ...n,
            startMin: parseMin(n.start),
            endMin: parseMin(n.end)
        }
    })

    parseMeeting.sort((a, b) => a.endMin - b.endMin)

    let scheduled: number[] = []
    let lastEnd = 0
    for (let data of parseMeeting) {
        if (data.startMin < lastEnd) continue
        scheduled.push(data.id);
        lastEnd = data.endMin;
    }

    return { scheduled, count: scheduled.length}
}

const meeting = [
    { "id": 2, "start": "09:45", "end": "10:35" },
    { "id": 1, "start": "09:00", "end": "10:30" },
    { "id": 3, "start": "10:40", "end": "12:00" },
    { "id": 4, "start": "13:00", "end": "14:00" },
]

console.log(ScheduledMeeting(meeting))