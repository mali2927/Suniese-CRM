import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import Sidebar from "../SideBar";
import { styles } from "../../Styles/dashboardStyles";
import config from '../../../src/config'; // Import the config file

const Users = () => {
  // State for managing users and loading status
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state

  // Function to fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${config.baseURL}/showUsers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const result = await response.json();
  
      if (result.success) {
        // Map the data to ensure `role` is transformed to `designation`
        const mappedUsers = result.data.map((user) => ({
          ...user,
          designation: user.role, // Map role to designation
          active: user.status !== null ? user.status : true, // If status is null, set it to true (active)
        }));
  
        setUsers(mappedUsers); // Update users state with mapped data
      } else {
        alert('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('An error occurred while fetching users.');
    } finally {
      setLoading(false); // Set loading to false after the fetch is complete
    }
  };
  

  // useEffect to fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // State for new user, editing user, and search term
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    designation: "",
    active: true, // Default to active when adding new users
  });
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Add new user
  const addUser = async () => {
    // Define the email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if all fields are filled
    if (newUser.name && newUser.email && newUser.designation) {
      // Validate the email format
      if (!emailRegex.test(newUser.email)) {
        alert('Please enter a valid email address.');
        return; // Stop execution if email is invalid
      }

      try {
        // Send a POST request to the backend
        const response = await fetch(`${config.baseURL}/addUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newUser.name,
            email: newUser.email,
            designation: newUser.designation,
          }),
        });

        // Parse the response data
        const result = await response.json();

        if (response.ok) {
          // Assuming 'id' is returned from the API response
          const id = result.id || (users.length ? users[users.length - 1].id + 1 : 1);

          // Update local state with the new user
          setUsers([...users, { id, ...newUser }]);
          setNewUser({ name: '', email: '', designation: '', active: true });

          // Show success message
          alert(result.message || 'User added successfully!');
        } else {
          // If the response is not okay, handle the error message from the backend
          alert(result.message || 'Failed to add user. Please try again.');
        }
      } catch (error) {
        console.error('Error adding user:', error);
        alert('An error occurred while adding the user. Please try again.');
      }
    } else {
      alert('Please fill out all fields.');
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
    setNewUser({ name: "", email: "", designation: "", active: true });
  };

  // Toggle user active status
  const toggleActiveStatus = (id) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, active: !user.active } : user
      )
    );
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    (user.name ? user.name.toLowerCase() : "").includes(searchTerm.toLowerCase()) ||
    (user.email ? user.email.toLowerCase() : "").includes(searchTerm.toLowerCase()) ||
    (user.designation ? user.designation.toLowerCase() : "").includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div style={styles.container}>
        <Sidebar />
        <main style={styles.mainContent}>
          <Navbar />
          <div className="container mt-4">
            <h2 className="mb-4">Users Management</h2>

            {/* Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            {/* User Form */}
            <div className="card p-4 mb-4">
              <div className="row">
                <div className="col-md-3">
                  <input
                    type="text"
                    name="name"
                    className="form-control mb-2"
                    placeholder="Name"
                    value={newUser.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="email"
                    name="email"
                    className="form-control mb-2"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
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
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.designation}</td>
                    <td>{user.active ? "Active" : "Inactive"}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning mx-2"
                        onClick={() => startEditUser(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger mx-2"
                        onClick={() => deleteUser(user.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-sm btn-secondary mx-2"
                        onClick={() => toggleActiveStatus(user.id)}
                      >
                        {user.active ? "Deactivate" : "Activate"}
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
