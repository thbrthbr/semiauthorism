'use client'

export default function DatePicker({ pollEndRef }: any) {
  return (
    <div className="w-full flex items-between justify-between">
      <div className="text-sm">종료 시간 (첫공개기준)</div>
      <select ref={pollEndRef} className="text-black w-36">
        <option value="5">5분 후</option>
        <option value="10">10분 후</option>
        <option value="20">20분 후</option>
        <option value="30">30분 후</option>
        <option value="40">40분 후</option>
        <option value="50">50분 후</option>
        <option value="60">1시간 후</option>
        <option value="120">2시간 후</option>
        <option value="180">3시간 후</option>
        <option value="240">4시간 후</option>
        <option value="300">5시간 후</option>
        <option value="360">6시간 후</option>
        <option value="420">7시간 후</option>
        <option value="480">8시간 후</option>
        <option value="540">9시간후</option>
        <option value="600">10시간 후</option>
        <option value="660">11시간 후</option>
        <option value="720">12시간 후</option>
        <option value="1440">1일 후</option>
        <option value="2880">2일 후</option>
        <option value="4320">3일 후</option>
        <option value="5760">4일 후</option>
        <option value="7200">5일 후</option>
        <option value="8640">6일 후</option>
        <option value="10080">일주일 후</option>
        <option value="20160">2주 후</option>
        <option value="30240">3주 후</option>
        <option value="40320">4주 후</option>
      </select>
    </div>
  )
}
