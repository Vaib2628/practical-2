import { useEffect, useState } from 'react'

export default function ContactModal({ open, onClose, onSave, initial }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [photo, setPhoto] = useState(null)

  useEffect(() => {
    if (initial) {
      setName(initial.name || '')
      setEmail(initial.email || '')
      setPhone(initial.phone || '')
      setPhoto(null)
    }
  }, [initial])

  function submit(e) {
    e.preventDefault()
    const fd = new FormData()
    fd.append('name', name)
    fd.append('email', email)
    fd.append('phone', phone)
    if (photo) fd.append('photo', photo)
    onSave(fd)
  }

  if (!open) return null
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)' }}>
      <div style={{ maxWidth: 420, margin: '10% auto', background: '#fff', padding: 20, borderRadius: 8 }}>
        <h3>{initial ? 'Edit Contact' : 'Add Contact'}</h3>
        <form onSubmit={submit}>
          <div>
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div>
            <label>Photo</label>
            <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0] || null)} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

