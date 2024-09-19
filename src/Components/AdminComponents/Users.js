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

  // Define available designations
  const designationOptions = [
    "Sales Consultant",
    "Senior Sales Consultant",
    "Energy Consultant",
    "HR Specialist",
    "Marketing Coordinator",
    // Add more designations as needed
  ];

  // State for new user, editing user, and search term
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    designation: "Sales Consultant", // Set default designation
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
          // Optionally, you can remove the local state update and rely solely on fetchUsers
          // But keeping it can provide immediate UI feedback
          const id = result.id || (users.length ? users[users.length - 1].id + 1 : 1);
          setUsers([...users, { id, ...newUser }]);
          setNewUser({ name: '', email: '', designation: 'Sales Consultant', active: true }); // Reset designation to default

          // Show success message
          alert(result.message || 'User added successfully!');

          // **Fetch the updated list of users**
          fetchUsers();
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
  const deleteUser = async (id) => {
    try {
      const response = await fetch(`${config.baseURL}/deleteUser`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (response.ok) {
        // Optionally, remove the user from local state
        setUsers(users.filter((user) => user.id !== id));
        alert(result.message || 'User deleted successfully!');

        // **Fetch the updated list of users**
        fetchUsers();
      } else {
        alert(result.message || 'Failed to delete user.');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting the user.');
    }
  };

  // Edit user
  const startEditUser = (user) => {
    setEditingUser(user);
    setNewUser(user);
  };

  // Save edited user
  const saveUser = async () => {
    // If email is not editable, ensure it's preserved
    const updatedUser = { ...newUser, email: editingUser.email };

    try {
      // Send a PUT request to update the user
      const response = await fetch(`${config.baseURL}/updateUser`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      const result = await response.json();

      if (response.ok) {
        setEditingUser(null);
        setNewUser({ name: "", email: "", designation: "Sales Consultant", active: true }); // Reset designation to default

        // Show success message
        alert(result.message || 'User updated successfully!');

        // **Fetch the updated list of users**
        fetchUsers();
      } else {
        // Handle backend error
        alert(result.message || 'Failed to update user. Please try again.');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('An error occurred while updating the user. Please try again.');
    }
  };

  // Toggle user active status
  const toggleActiveStatus = async (id) => {
    try {
      const userToToggle = users.find(user => user.id === id);
      if (!userToToggle) {
        alert('User not found.');
        return;
      }

      // Send a PUT request to update the user's active status
      const response = await fetch(`${config.baseURL}/toggleUserStatus`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, active: !userToToggle.active }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || 'User status updated successfully!');

        // **Fetch the updated list of users**
        fetchUsers();
      } else {
        alert(result.message || 'Failed to update user status.');
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('An error occurred while updating the user status.');
    }
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
                    disabled={editingUser !== null} // Disable when editing
                  />
                </div>
                <div className="col-md-3">
                  {/* Designation Dropdown */}
                  <select
                    name="designation"
                    className="form-control mb-2"
                    value={newUser.designation}
                    onChange={handleChange}
                  >
                    {designationOptions.map((designation, index) => (
                      <option key={index} value={designation}>
                        {designation}
                      </option>
                    ))}
                  </select>
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
                {editingUser && (
                  <button
                    className="btn btn-secondary mx-2"
                    onClick={() => {
                      setEditingUser(null);
                      setNewUser({ name: "", email: "", designation: "Sales Consultant", active: true }); // Reset designation to default
                    }}
                  >
                    Cancel
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
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
};

export default Users;
