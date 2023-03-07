import React, { useCallback, useEffect, useState } from 'react';

import {
  Alert,
  Button,
  Container,
  Dropdown,
  Form,
  Modal,
  Table,
} from 'react-bootstrap';
import { FieldValues, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import MainAPIClient from '../../../api/client';
import IPerson from '../../../api/persons/types';
import LinkMain from '../../../components/link/main';

const HomeMain: React.FC = () => {
  const [people, setPeople] = useState<IPerson[]>([]);
  const [peopleLoading, setPeopleLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMultiDeleteModal, setShowMultiDeleteModal] = useState(false);
  const [personSearch, setPersonSearch] = useState('');
  const [refetchData, setRefetchData] = useState('');
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [undoSuccess, setUndoSuccess] = useState(0);

  const router = useRouter();
  const createSuccess = !!router.query?.success;
  const deleteSuccess = !!router.query?.deleteSuccess;
  const deletedPeople = router.query?.deletedPeople;

  const undoDelete = () => {
    MainAPIClient.put('/people/restore', undefined, {
      params: {
        persons: deletedPeople,
      },
    })
      .then(() => {
        setUndoSuccess(undoSuccess + 1);
      })
      .catch(() => {
        setUndoSuccess(0);
      });
  };

  useEffect(() => {
    const fetchPersons = () => {
      MainAPIClient.get('/people', {
        params: {
          fullName: refetchData,
        },
      })
        .then((res) => {
          setPeopleLoading(false);
          setPeople(res.data.data as IPerson[]);
        })
        .catch(() => {
          setPeople([]);
          setPeopleLoading(false);
        });
    };

    setPeopleLoading(true);
    fetchPersons();

    return () => {
      setPeople([]);
    };
  }, [createSuccess, refetchData, deleteSuccess, undoSuccess]);

  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      setRefetchData(personSearch);
      setSelectedPeople([]);
    }, 1000);

    return () => {
      clearTimeout(typingTimeout);
    };
  }, [personSearch]);

  return (
    <>
      <main className="container-lg mt-3">
        <h1 className="mb-4 text-center">People Directory</h1>
        <div>
          <Container className="d-flex align-items-center justify-content-between mb-4">
            <h3>List of People</h3>
            <Button
              type="button"
              onClick={() => {
                setShowCreateModal(true);
                delete router.query?.success;
              }}
              className="primary btn-sm p-2"
            >
              Create New Person
            </Button>
            <CreatePersonModal
              show={showCreateModal}
              handleClose={() => setShowCreateModal(false)}
            />
          </Container>
          {createSuccess && (
            <Alert variant="success" className="p-2">
              New Person added successfully
            </Alert>
          )}
          {deleteSuccess && (
            <Alert variant="success" className="p-2">
              Deleted Multiple Selected People successfully{' '}
              {deletedPeople && (
                <Button type="button" onClick={undoDelete} variant="success">
                  Undo
                </Button>
              )}
            </Alert>
          )}
          <div className="input-group input-group-xl mb-3">
            <span className="input-group-text" id="inputGroup-sizing-xl">
              Search By Person Full Name
            </span>
            <input
              type="text"
              onChange={(e) => setPersonSearch(e.target.value)}
              value={personSearch}
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
            />
          </div>
          <Dropdown className="mb-2">
            <Dropdown.Toggle
              variant="white"
              style={{ border: '2px solid rgba(0, 0, 0, 0.175)' }}
              id="dropdown-basic"
            >
              Action
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                color="red"
                disabled={!selectedPeople.length}
                onClick={() => {
                  setShowMultiDeleteModal(true);
                  delete router.query?.deleteSuccess;
                }}
              >
                Delete Selected People
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <DeleteMultiplePeopleModal
            clearSelectedPeople={() => setSelectedPeople([])}
            handleClose={() => setShowMultiDeleteModal(false)}
            people={selectedPeople}
            show={showMultiDeleteModal}
          />
          <Table striped bordered hover>
            <thead>
              <tr>
                <th scope="col">Select</th>
                <th scope="col">Person #</th>
                <th scope="col">Full Name</th>
                <th scope="col">Age</th>
                <th scope="col">Gender</th>
                <th scope="col">Email</th>
                <th scope="col">Follow</th>
              </tr>
            </thead>
            <tbody>
              {!peopleLoading &&
                people.length > 0 &&
                people.map((person) => (
                  <tr key={person.id}>
                    <td>
                      <div className="form-check">
                        <input
                          onChange={(e) => {
                            const allSelectedPeople = [
                              ...selectedPeople,
                              person.id,
                            ];
                            if (e.target.checked) {
                              setSelectedPeople(allSelectedPeople);
                            } else {
                              setSelectedPeople(
                                allSelectedPeople.filter(
                                  (val) => val !== person.id,
                                ),
                              );
                            }
                          }}
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </td>
                    <th scope="row">
                      <LinkMain to={`/people/${person.id}`}>
                        {person.id}
                      </LinkMain>
                    </th>
                    <td>{person.fullName}</td>
                    <td>{person.age || '-'}</td>
                    <td>{person.gender || '-'}</td>
                    <td>{person.email || '-'}</td>
                    <td>
                      <LinkMain to={`/people/${person.id}`}>
                        View Details
                      </LinkMain>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          {peopleLoading && (
            <p
              style={{ width: '100%' }}
              className="container-lg placeholder-glow w-100"
            >
              <span
                className="placeholder col-12 m-2"
                style={{ width: '100%' }}
              />
              <span
                className="placeholder col-12 m-2"
                style={{ width: '100%' }}
              />
              <span
                className="placeholder col-12 m-2"
                style={{ width: '100%' }}
              />
              <span
                className="placeholder col-12 m-2"
                style={{ width: '100%' }}
              />
            </p>
          )}
        </div>
      </main>
    </>
  );
};

const CreatePersonModal: React.FC<{
  show: boolean;
  handleClose: () => void;
}> = ({ handleClose, show }) => {
  const [success, setSuccess] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm();
  const router = useRouter();

  const onSubmit = (data: FieldValues) => {
    const { fullName, email, password, age, gender } = data;
    if (show) {
      MainAPIClient.post('/people', {
        fullName,
        email,
        password,
        age,
        gender,
      })
        .then((res) => {
          if (res.data.success) {
            setSuccess(true);
            setErrorMessages([]);
          }
        })
        .catch((err) => {
          const errorMessage = err.response?.data?.message;
          if (errorMessage && typeof errorMessage === 'string') {
            setErrorMessages([errorMessage]);
          } else if (errorMessage.length > 0) {
            setErrorMessages((prev) => [...errorMessage, ...prev]);
          }
        });
    }
  };

  const handleModalClose = useCallback(() => {
    handleClose();
    reset();
    setErrorMessages([]);
    setSuccess(false);
  }, [handleClose, reset, setErrorMessages, setSuccess]);

  useEffect(() => {
    if (isSubmitSuccessful && success) {
      void router.push({
        search: `?success=true`,
      });
      handleModalClose();
    }
  }, [success, isSubmitSuccessful, router, handleModalClose]);

  return (
    <Modal
      centered
      show={show}
      onHide={() => {
        handleModalClose();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Create New Person</Modal.Title>
      </Modal.Header>
      <Modal.Body className="mb-2">
        {errorMessages.length > 0 &&
          errorMessages.map((message: string) => (
            <Alert
              key={`${message}-${new Date()}`}
              variant="danger"
              className="p-2"
            >
              {message}
            </Alert>
          ))}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3 has-validation" controlId="fullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Full Name"
              {...register('fullName', { required: 'Full Name is required' })}
            />
            {errors.fullName && (
              <div style={{ color: 'red', fontSize: '14px' }}>
                {`${errors.fullName?.message}`}
              </div>
            )}
          </Form.Group>
          <Form.Group className="mb-3 has-validation" controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && (
              <div style={{ color: 'red', fontSize: '14px' }}>
                {`${errors.email?.message}`}
              </div>
            )}
          </Form.Group>
          <Form.Group className="mb-3 has-validation" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && (
              <div style={{ color: 'red', fontSize: '14px' }}>
                {`${errors.password?.message}`}
              </div>
            )}
            <Form.Text>
              The minimum password length is 8 characters and must contain at
              least 1 lowercase letter, 1 capital letter 1 nurnber and 1 special
              character
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3 has-validation" controlId="age">
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Age"
              {...register('age', { valueAsNumber: true })}
            />
            {errors.age && (
              <div style={{ color: 'red', fontSize: '14px' }}>
                {`${errors.age?.message}`}
              </div>
            )}
          </Form.Group>
          <Form.Group className="mb-3 has-validation" controlId="gender">
            <Form.Label>Gender</Form.Label>
            <Form.Select placeholder="Select Gender" {...register('gender')}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Form.Select>
            {errors.gender && (
              <div style={{ color: 'red', fontSize: '14px' }}>
                {`${errors.gender?.message}`}
              </div>
            )}
          </Form.Group>
          <Container className="d-flex mt-4" style={{ gap: '10px' }}>
            <Button
              variant="secondary"
              onClick={() => {
                handleModalClose();
              }}
            >
              Close
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Container>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

const DeleteMultiplePeopleModal: React.FC<{
  people: number[];
  clearSelectedPeople: () => void;
  show: boolean;
  handleClose: () => void;
}> = ({ handleClose, people, show, clearSelectedPeople }) => {
  const [success, setSuccess] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const router = useRouter();

  const onDeleteConfirm = () => {
    MainAPIClient.delete(`/people`, {
      params: {
        persons: people.join(','),
      },
    })
      .then((res) => {
        if (res.data.success) {
          setSuccess(true);
          setErrorMessages([]);
        }
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message;
        if (errorMessage && typeof errorMessage === 'string') {
          setSuccess(false);
          setErrorMessages([errorMessage]);
        } else if (errorMessage.length > 0) {
          setSuccess(false);
          setErrorMessages((prev) => [...errorMessage, ...prev]);
        }
      });
  };

  const handleModalClose = useCallback(() => {
    handleClose();
    setSuccess(false);
    setErrorMessages([]);
  }, [handleClose, setErrorMessages, setSuccess]);

  useEffect(() => {
    if (success) {
      void router.push({
        search: `?deleteSuccess=true&deletedPeople=${people.join(',')}`,
        pathname: window.location.pathname,
      });
      clearSelectedPeople();
      handleModalClose();
    }
  }, [success, router, clearSelectedPeople, handleModalClose, people]);

  return (
    <Modal
      centered
      show={show}
      onHide={() => {
        handleModalClose();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete Person</Modal.Title>
      </Modal.Header>
      <Modal.Body className="mb-2">
        {errorMessages.length > 0 &&
          errorMessages.map((message: string) => (
            <Alert key={message} variant="danger" className="p-2">
              {message}
            </Alert>
          ))}
        Are you sure you want to delete these selected people:{' '}
        {people.join(',')}?
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="danger" onClick={onDeleteConfirm}>
          Delete People
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default HomeMain;
