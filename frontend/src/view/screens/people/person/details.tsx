import React, { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from 'react-bootstrap';
import dayjs from 'dayjs';
import { FieldValues, useForm } from 'react-hook-form';

import MainAPIClient from '../../../../api/client';
import IPerson, { IContactInfo } from '../../../../api/persons/types';
import LoaderMain from '../../../widgets/loader/main';
import filterEditedFields from '../../../../helpers/filterEditedFields';

const PersonDetails: React.FC = () => {
  const [person, setPerson] = useState<IPerson>({} as IPerson);
  const [personLoading, setPersonLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);

  const router = useRouter();
  const personId = router.query?.id;
  const updateSuccess = router.query?.success;
  const deleteSuccess = router.query?.deleteSuccess;
  const contactSuccess = router.query?.contactSuccess;

  useEffect(() => {
    if (personId) {
      const fetchPersons = () => {
        MainAPIClient.get(`/people/${personId}`)
          .then((res) => {
            setPersonLoading(false);
            setPerson(res.data.data as IPerson);
          })
          .catch(() => {
            setPerson({} as IPerson);
            setPersonLoading(false);
          });
      };

      setPersonLoading(true);
      fetchPersons();
    }

    return () => {
      setPerson({} as IPerson);
    };
  }, [personId, updateSuccess, contactSuccess]);

  useEffect(() => {
    if (deleteSuccess) {
      void router.push('/');
    }
  }, [deleteSuccess, router]);

  return (
    <>
      <main className="container-lg mt-3">
        <Container className="d-flex justify-content-between align-items-center">
          <h2 className="mb-5 mt-5">Person Details</h2>
          <div className="d-flex" style={{ gap: '10px' }}>
            <Button
              type="button"
              onClick={() => {
                setShowUpdateModal(true);
                delete router.query?.success;
              }}
              className="primary btn-sm p-2"
            >
              Update Person
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                setShowDeleteModal(true);
                delete router.query?.success;
              }}
              className="primary btn-sm p-2"
            >
              Delete Person
            </Button>
          </div>
          <UpdatePersonModal
            person={person}
            handleClose={() => setShowUpdateModal(false)}
            show={showUpdateModal}
          />
          <DeletePersonModal
            person={person}
            handleClose={() => setShowDeleteModal(false)}
            show={showDeleteModal}
          />
        </Container>
        {updateSuccess && (
          <Alert variant="success" className="p-2">
            New Person added successfully
          </Alert>
        )}
        {personLoading && <LoaderMain />}
        {!personLoading && person.id && (
          <>
            <Container>
              <Row>
                <Col xs={6} md={4}>
                  ID: <strong>{person.id}</strong>
                </Col>
                <Col xs={6} md={4}>
                  Email: <strong>{person.email}</strong>
                </Col>
                <Col xs={6} md={4}>
                  Name: <strong>{person.fullName}</strong>
                </Col>
              </Row>
              <Row>
                <Col xs={6} md={4}>
                  Age: <strong>{person.age || 'N/A'}</strong>
                </Col>
                <Col xs={6} md={4}>
                  Gender: <strong>{person.gender || 'N/A'}</strong>
                </Col>
                <Col xs={6} md={4}>
                  Status:{' '}
                  <Badge bg={person.isActive ? 'success' : 'danger'}>
                    {person.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </Col>
                <Col xs={6} md={4}>
                  Verification Status:{' '}
                  <Badge bg={person.isVerified ? 'success' : 'danger'}>
                    {person.isVerified ? 'Verified' : 'Unverified'}
                  </Badge>
                </Col>
                <Col xs={6} md={4}>
                  Date Created:{' '}
                  <strong>
                    {person.createTime
                      ? dayjs(person.createTime).format('YYYY-MM-DD hh:mm A')
                      : 'N/A'}
                  </strong>
                </Col>
              </Row>
            </Container>
            <Container>
              <Container className="d-flex justify-content-between align-items-center">
                <h4 className="mt-5 mb-3">Contact Info</h4>
                <Button
                  type="button"
                  onClick={() => {
                    setShowAddContactModal(true);
                    delete router.query?.contactSuccess;
                  }}
                  className="primary btn-sm p-2"
                >
                  Add Contact Info
                </Button>
                <AddContactModal
                  show={showAddContactModal}
                  person={person}
                  handleClose={() => setShowAddContactModal(false)}
                />
              </Container>
              {contactSuccess && (
                <Alert variant="success" className="p-2">
                  New Contact Info added successfully
                </Alert>
              )}
              {person.contactInfo &&
                person.contactInfo?.length > 0 &&
                person.contactInfo?.map((info, index) => (
                  <ContactInfo key={info.id} contact={info} index={index} />
                ))}
              {person.contactInfo &&
                person.contactInfo?.length === 0 &&
                'This person has no contact info added'}
            </Container>
          </>
        )}
      </main>
    </>
  );
};

const ContactInfo: React.FC<{ contact: IContactInfo; index: number }> = ({
  contact,
  index,
}) => (
  <Card className="mb-3">
    <Card.Header>Info {index + 1}</Card.Header>
    <Card.Body>
      <dl className="row">
        <dt className="col-sm-3">Street</dt>
        <dd className="col-sm-9">{contact.street}</dd>
        <dt className="col-sm-3">City</dt>
        <dd className="col-sm-9">{contact.city}</dd>
        <dt className="col-sm-3">State</dt>
        <dd className="col-sm-9">{contact.state}</dd>
        <dt className="col-sm-3">Country</dt>
        <dd className="col-sm-9">{contact.country}</dd>
        <dt className="col-sm-3">Zip</dt>
        <dd className="col-sm-9">{contact.zip}</dd>
        <dt className="col-sm-3">Email</dt>
        <dd className="col-sm-9">{contact.email}</dd>
        <dt className="col-sm-3">Phone</dt>
        <dd className="col-sm-9">{contact.phone}</dd>
      </dl>
    </Card.Body>
  </Card>
);

const UpdatePersonModal: React.FC<{
  person: IPerson;
  show: boolean;
  handleClose: () => void;
}> = ({ handleClose, person, show }) => {
  const [success, setSuccess] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, dirtyFields },
  } = useForm();
  const router = useRouter();

  const onSubmit = (data: FieldValues) => {
    const { fullName, email, age, gender, isActive } = data;
    const dirtyInputs = filterEditedFields(
      {
        fullName,
        email,
        age,
        gender,
        isActive: isActive === 'true',
      },
      dirtyFields,
    );
    MainAPIClient.put(`/people/${person.id}`, {
      ...dirtyInputs,
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
    if (isSubmitSuccessful && success) {
      void router.push({
        search: `?success=true`,
        pathname: window.location.pathname,
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
        <Modal.Title>Update Person</Modal.Title>
      </Modal.Header>
      <Modal.Body className="mb-2">
        {errorMessages.length > 0 &&
          errorMessages.map((message: string) => (
            <Alert key={message} variant="danger" className="p-2">
              {message}
            </Alert>
          ))}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3 has-validation" controlId="fullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              defaultValue={person.fullName}
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
              defaultValue={person.email}
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
          <Form.Group className="mb-3 has-validation" controlId="age">
            <Form.Label>Age</Form.Label>
            <Form.Control
              defaultValue={person.age}
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
            <Form.Select
              defaultValue={person.gender}
              placeholder="Select Gender"
              {...register('gender')}
            >
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
          <Form.Group className="mb-3 has-validation" controlId="isActive">
            <Form.Label>Status</Form.Label>
            <Form.Select
              defaultValue={person.isActive ? 'true' : 'false'}
              placeholder="Select Status"
              {...register('isActive')}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Form.Select>
            {errors.isActive && (
              <div style={{ color: 'red', fontSize: '14px' }}>
                {`${errors.isActive?.message}`}
              </div>
            )}
          </Form.Group>
          <Form.Group className="mb-3 has-validation" controlId="isVerified">
            <Form.Label>Verification Status</Form.Label>
            <Form.Select
              defaultValue={person.isVerified ? 'true' : 'false'}
              placeholder="Select Verification Status"
              {...register('isVerified')}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Form.Select>
            {errors.isActive && (
              <div style={{ color: 'red', fontSize: '14px' }}>
                {`${errors.isActive?.message}`}
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

const DeletePersonModal: React.FC<{
  person: IPerson;
  show: boolean;
  handleClose: () => void;
}> = ({ handleClose, person, show }) => {
  const [success, setSuccess] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const router = useRouter();

  const onDeleteConfirm = () => {
    MainAPIClient.delete(`/people/${person.id}`)
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
        search: `?deleteSuccess=true`,
        pathname: window.location.pathname,
      });
      handleModalClose();
    }
  }, [success, router, handleModalClose]);

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
        Are you sure you want to delete person: {person.fullName}?
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="danger" onClick={onDeleteConfirm}>
          Delete Person
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const AddContactModal: React.FC<{
  show: boolean;
  handleClose: () => void;
  person: IPerson;
}> = ({ handleClose, show, person }) => {
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
    const { street, city, country, email, phone, state, zip } = data;
    if (show) {
      MainAPIClient.post(`/people/${person.id}/contact`, {
        street,
        city,
        country,
        email,
        phone,
        state,
        zip,
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
        search: `?contactSuccess=true`,
        pathname: window.location.pathname,
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
        <Modal.Title>Add Contact Info for {person.fullName}</Modal.Title>
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
          <Form.Group className="mb-3 has-validation" controlId="street">
            <Form.Label>Street Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Street"
              {...register('street', { required: 'Street is required' })}
            />
            {errors.street && (
              <div style={{ color: 'red', fontSize: '14px' }}>
                {`${errors.street?.message}`}
              </div>
            )}
          </Form.Group>
          <Form.Group className="mb-3 has-validation" controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter city"
              {...register('city', { required: 'City is required' })}
            />
            {errors.city && (
              <div style={{ color: 'red', fontSize: '14px' }}>
                {`${errors.city?.message}`}
              </div>
            )}
          </Form.Group>
          <Form.Group className="mb-3 has-validation" controlId="state">
            <Form.Label>State</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter state"
              {...register('state', { required: 'State is required' })}
            />
            {errors.state && (
              <div style={{ color: 'red', fontSize: '14px' }}>
                {`${errors.state?.message}`}
              </div>
            )}
          </Form.Group>
          <Form.Group className="mb-3 has-validation" controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter country"
              {...register('country', { required: 'Country is required' })}
            />
            {errors.country && (
              <div style={{ color: 'red', fontSize: '14px' }}>
                {`${errors.country?.message}`}
              </div>
            )}
          </Form.Group>
          <Form.Group className="mb-3 has-validation" controlId="zip">
            <Form.Label>Zip</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Zip"
              {...register('zip', {
                required: 'Zip is required',
                valueAsNumber: true,
              })}
            />
            {errors.zip && (
              <div style={{ color: 'red', fontSize: '14px' }}>
                {`${errors.zip?.message}`}
              </div>
            )}
          </Form.Group>
          <Form.Group className="mb-3 has-validation" controlId="email">
            <Form.Label>Email</Form.Label>
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
          <Form.Group className="mb-3 has-validation" controlId="phone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter phone"
              {...register('phone', {
                required: 'Phone is required',
                valueAsNumber: true,
              })}
            />
            {errors.phone && (
              <div style={{ color: 'red', fontSize: '14px' }}>
                {`${errors.phone?.message}`}
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

export default PersonDetails;
