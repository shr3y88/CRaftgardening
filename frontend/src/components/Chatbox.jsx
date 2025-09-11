import { useState } from 'react'

const hints = {
  water: 'Most indoor plants like soil kept slightly moist. Water when top 1-2cm is dry.',
  light: 'Bright, indirect light suits many indoor plants. Avoid harsh midday sun.',
  soil: 'Use well-draining potting mix; add perlite for aeration.',
  pests: 'Inspect leaves weekly. Wipe with soapy water or neem oil if pests appear.',
}

export default function Chatbox() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Hi! Ask me about water, light, soil, or pests.' }])

  const send = () => {
    if (!input.trim()) return
    const q = input.trim().toLowerCase()
    const key = Object.keys(hints).find(k => q.includes(k))
    const answer = key ? hints[key] : 'Try keywords: water, light, soil, pests.'
    setMessages(m => [...m, { role: 'user', text: input }, { role: 'assistant', text: answer }])
    setInput('')
  }

  return (
    <div className="fixed bottom-5 right-5 z-30">
      {open && (
        <div className="w-80 h-96 rounded-2xl border shadow-lg bg-white flex flex-col overflow-hidden">
          <div className="p-3 bg-emerald-600 text-white flex items-center justify-between">
            <span className="font-semibold">Plant Care Assistant</span>
            <button onClick={()=>setOpen(false)} className="text-white/80 hover:text-white">✕</button>
          </div>
          <div className="flex-1 p-3 space-y-2 overflow-auto">
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[85%] ${m.role==='assistant'?'bg-emerald-50 text-emerald-900':'bg-slate-100 text-slate-900'} rounded-xl px-3 py-2`}>{m.text}</div>
            ))}
          </div>
          <div className="p-3 border-t flex gap-2">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask about water, light..." className="input flex-1" />
            <button onClick={send} className="btn-primary">Send</button>
          </div>
        </div>
      )}
      {!open && (
        <button onClick={()=>setOpen(true)} className="rounded-full h-12 w-12 bg-emerald-600 text-white shadow-lg hover:bg-emerald-700">💬</button>
      )}
    </div>
  )
}


