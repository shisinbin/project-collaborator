import { useEffect, useState } from 'react';
import Select from 'react-select';
import { useCollection } from '../../hooks/useCollection';
import { Timestamp } from 'firebase/firestore';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFirestore } from '../../hooks/useFirestore';
import { useNavigate } from 'react-router-dom';

// styles
import './Create.css';

const categories = [
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
];

export default function Create() {
  const navigate = useNavigate();
  // grab function to add doc, and the response object
  const { addDocument, response } = useFirestore('projects');
  // grab the user data from the firestore db collection 'users'
  const { documents } = useCollection('users');
  // create some state to nicely show users for the dropdown menu
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    details: '',
    dueDate: '',
    category: '',
    assignedUsers: [],
  });

  const [formError, setFormError] = useState(null);

  // to determine who is creating the project
  const { user } = useAuthContext();

  useEffect(() => {
    // when component renders, if there are users, then nicely format them for the dropdown
    if (documents) {
      const options = documents.map((user) => {
        return {
          value: user,
          label: user.displayName,
        };
      });
      setUsers(options);
    }
    // re-run this anytime there's new users added
  }, [documents]);

  // a more robust way of navigating away when user has added a project
  useEffect(() => {
    if (response.success) {
      navigate('/');
    }
  }, [response.success, navigate]);

  const handleChange = (event) => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  };

  const handleCategoryChange = (selectedOption) => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        category: selectedOption.value,
      };
    });
  };

  const handleAssignedUsersChange = (selectedOptions) => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        assignedUsers: selectedOptions,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);

    // Check if a category has been chosen
    if (formData.category.trim().length === 0) {
      setFormError('Please select a product category');
      return;
    }
    // Check if a user has been chosen
    if (formData.assignedUsers.length === 0) {
      setFormError('Please assign the project to at least one user');
      return;
    }

    const createdBy = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      id: user.uid,
    };

    const assignedUsersList = formData.assignedUsers.map((user) => {
      return {
        displayName: user.value.displayName,
        photoURL: user.value.photoURL,
        id: user.value.id,
      };
    });

    const project = {
      name: formData.name,
      details: formData.details,
      category: formData.category,
      dueDate: Timestamp.fromDate(new Date(formData.dueDate)),
      comments: [],
      createdBy: createdBy,
      assignedUsersList,
    };

    // console.log('project', project);
    await addDocument(project);
  };

  return (
    <div className='create-form'>
      <h2 className='page-title'>Create a new project</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Project name:</span>
          <input
            required
            type='text'
            name='name'
            onChange={handleChange}
            value={formData.name}
          />
        </label>
        <label>
          <span>Project details:</span>
          <textarea
            required
            type='text'
            name='details'
            onChange={handleChange}
            value={formData.details}
          ></textarea>
        </label>
        <label>
          <span>Set due date:</span>
          <input
            required
            type='date'
            name='dueDate'
            onChange={handleChange}
            value={formData.dueDate}
          />
        </label>
        <label>
          <span>Project category:</span>
          <Select options={categories} onChange={handleCategoryChange} />
        </label>
        <label>
          <span>Assign to:</span>
          <Select
            options={users}
            onChange={handleAssignedUsersChange}
            isMulti
          />
        </label>
        <button className='btn'>Add Project</button>
        {formError && <p className='error'>{formError}</p>}
      </form>
    </div>
  );
}
