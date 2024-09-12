import React, { useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../SideBar";
import { styles } from "../../Styles/dashboardStyles";

const Users = () => {
  // Dummy data for users
  const initialUsers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      designation: "Lead Collector",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      designation: "Sales Manager",
    },
  ];

  const [users, setUsers] = useState(initialUsers);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    designation: "",
  });
  const [editingUser, setEditingUser] = useState(null);

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  // Add new user
  const addUser = () => {
    if (newUser.name && newUser.email && newUser.designation) {
      const id = users.length ? users[users.length - 1].id + 1 : 1;
      setUsers([...users, { id, ...newUser }]);
      setNewUser({ name: "", email: "", designation: "" });
    }
  };

  // Delete user
  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  // Edit user
  const startEditUser = (user) => {
    setEditingUser(user);
    setNewUser(user);
  };

  // Save edited user
  const saveUser = () => {
    setUsers(
      users.map((user) => (user.id === editingUser.id ? newUser : user))
    );
    setEditingUser(null);
    setNewUser({ name: "", email: "", designation: "" });
  };

  return (
    <>
      <div style={styles.container}>
        <Sidebar />
        <main style={styles.mainContent}>
          <Navbar />
          <div className="container mt-4">
            <h2 className="mb-4">Users Management</h2>

            {/* User Form */}
            <div className="card p-4 mb-4">
              <div className="row">
                <div className="col-md-4">
                  <input
                    type="text"
                    name="name"
                    className="form-control mb-2"
                    placeholder="Name"
                    value={newUser.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="email"
                    name="email"
                    className="form-control mb-2"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    name="designation"
                    className="form-control mb-2"
                    placeholder="Designation"
                    value={newUser.designation}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                {editingUser ? (
                  <button className="btn btn-primary" onClick={saveUser}>
                    Save
                  </button>
                ) : (
                  <button className="btn btn-success" onClick={addUser}>
                    Add User
                  </button>
                )}
              </div>
            </div>

            {/* User Table */}
            <table className="table table-bordered table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Designation</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.designation}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning mr-2"
                        onClick={() => startEditUser(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
};

export default Users;