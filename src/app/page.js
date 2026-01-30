"use client";
import { useState, useEffect, useCallback } from "react";

export default function ItemManager() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    itemName: "",
    itemCategory: "",
    itemPrice: "",
    status: "ACTIVE",
  });

  const fetchItems = useCallback(async (currentPage) => {
    try {
      const res = await fetch(`/api/item?page=${currentPage}`);
      const result = await res.json();
      setItems(result.data || []);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchItems(page);
  }, [page, fetchItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = editingId ? `/api/item/${editingId}` : "/api/item";
    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setFormData({ itemName: "", itemCategory: "", itemPrice: "", status: "ACTIVE" });
    setEditingId(null);
    fetchItems(page);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this item?")) {
      await fetch(`/api/item/${id}`, { method: "DELETE" });
      fetchItems(page);
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      itemName: item.itemName,
      itemCategory: item.itemCategory,
      itemPrice: item.itemPrice,
      status: item.status,
    });
  };

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
        Item Management System
      </h1>

      <section style={{ background: "#f9f9f9", padding: "20px", borderRadius: "8px", marginBottom: "30px" }}>
        <h3>{editingId ? "Edit Item" : "Add New Item"}</h3>
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          <input 
            placeholder="Item Name" 
            value={formData.itemName} 
            onChange={(e) => setFormData({...formData, itemName: e.target.value})} 
            required 
            style={{ padding: "8px" }}
          />
          <input 
            placeholder="Category" 
            value={formData.itemCategory} 
            onChange={(e) => setFormData({...formData, itemCategory: e.target.value})} 
            required 
            style={{ padding: "8px" }}
          />
          <input 
            placeholder="Price" 
            type="number" 
            value={formData.itemPrice} 
            onChange={(e) => setFormData({...formData, itemPrice: e.target.value})} 
            required 
            style={{ padding: "8px" }}
          />
          <select 
            value={formData.status} 
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            style={{ padding: "8px" }}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
          <div style={{ gridColumn: "span 2", display: "flex", gap: "10px" }}>
            <button type="submit" style={{ background: "#0070f3", color: "white", padding: "10px 20px", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              {editingId ? "Update Item" : "Save Item"}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setFormData({itemName: "", itemCategory: "", itemPrice: "", status: "ACTIVE"}); }} style={{ padding: "10px" }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <table border="0" style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
        <thead>
          <tr style={{ background: "#333", color: "white" }}>
            <th style={{ padding: "12px" }}>Name</th>
            <th style={{ padding: "12px" }}>Category</th>
            <th style={{ padding: "12px" }}>Price</th>
            <th style={{ padding: "12px" }}>Status</th>
            <th style={{ padding: "12px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "12px" }}>{item.itemName}</td>
              <td style={{ padding: "12px" }}>{item.itemCategory}</td>
              <td style={{ padding: "12px" }}>${item.itemPrice}</td>
              <td style={{ padding: "12px" }}>
                <span style={{ color: item.status === "ACTIVE" ? "green" : "red", fontWeight: "bold" }}>
                  {item.status}
                </span>
              </td>
              <td style={{ padding: "12px", display: "flex", gap: "8px" }}>
                <button onClick={() => startEdit(item)} style={{ background: "#ffca28", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>Edit</button>
                <button onClick={() => handleDelete(item._id)} style={{ background: "#ef5350", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", alignItems: "center", gap: "15px" }}>
        <button 
          disabled={page <= 1} 
          onClick={() => setPage(page - 1)}
          style={{ padding: "8px 15px", cursor: page <= 1 ? "not-allowed" : "pointer" }}
        >
          Previous
        </button>
        <span style={{ fontWeight: "bold" }}>Page {page} of {totalPages}</span>
        <button 
          disabled={page >= totalPages} 
          onClick={() => setPage(page + 1)}
          style={{ padding: "8px 15px", cursor: page >= totalPages ? "not-allowed" : "pointer" }}
        >
          Next
        </button>
      </div>
    </div>
  );
}