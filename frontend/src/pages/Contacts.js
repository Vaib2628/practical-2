import { useEffect, useState } from 'react'
import { api } from '../api'
import { clearToken } from '../auth'
import ContactModal from '../components/ContactModal'

export default function Contacts() {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit, setLimit] = useState(10)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)

  async function load(p = page) {
    setLoading(true)
    try {
      const { data } = await api.get(`/contact?page=${p}&limit=${limit}`)
      setItems(data.items)
      setPage(data.page)
      setTotal(data.total)
    } catch (err) {
    } finally { setLoading(false) }
  }

  useEffect(() => { load(1) }, [])

  function openAdd() { setEditing(null); setShowModal(true) }
  function openEdit(item) { setEditing(item); setShowModal(true) }
  function closeModal() { setShowModal(false) }

  async function save(fd) {
    try {
      if (editing) {
        await api.put(`/contact/${editing._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else {
        await api.post('/contact', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      }
      closeModal()
      load(1)
    } catch (err) {}
  }

  async function remove(id) {
    await api.delete(`/contact/${id}`)
    load(page)
  }

  const pages = Math.ceil(total / limit)

  return (
    <div style={{ maxWidth: 800, margin: '20px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Contacts</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={openAdd}>Add Contact</button>
        </div>
      </div>
      {loading ? <p>Loading...</p> : (
        <table width="100%" border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c._id}>
                <td>{c.photoUrl ? <img src={c.photoUrl} alt="" width={48} height={48} /> : '-'}</td>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>
                  <button onClick={() => openEdit(c)}>Edit</button>
                  <button onClick={() => remove(c._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div style={{ marginTop: 12 }}>
        {Array.from({ length: pages }).map((_, i) => (
          <button key={i} disabled={page === i + 1} onClick={() => { setPage(i + 1); load(i + 1) }}>{i + 1}</button>
        ))}
      </div>
      <ContactModal open={showModal} onClose={closeModal} onSave={save} initial={editing} />
    </div>
  )
}
