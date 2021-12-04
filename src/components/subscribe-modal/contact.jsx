import React, { Fragment, useState, useEffect } from "react";
import userService from "../../../services/userService";
import Sidebar from "../../../common/sidebar/sidebar";
import AddContact from "./add-contact";
import { confirmAlert } from "react-confirm-alert";
import ConfirmDelete from "../../../common/confirm-delete/confirm-delete";
import "./contact.css";
import Loading from "../../../common/loading/loading";

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      const { contacts } = await userService.getUser();
      setContacts(contacts);
      setLoading(false);
    };

    getUser();
  }, [contacts]);

  const [isSidebarVisible, setSidebarVisibility] = useState(false);
  const [contactProfile, setContactProfile] = useState(null);

  const [isModalVisible, setModalVisibility] = useState(null);

  const handleViewProfile = (id) => {
    setContactProfile(getProfile(id));
    setSidebarVisibility(true);
  };

  const handleSidebarClose = () => {
    setSidebarVisibility(false);
    setContactProfile("");
  };

  const getProfile = (id) => {
    return contacts.find((user) => user.id === id);
  };

  const handleModalVisibility = () => {
    setModalVisibility(false);
  };

  const confirmDelete = (contact) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <ConfirmDelete
            onClose={onClose}
            handleDelete={() => handleContactDelete(contact)}
          />
        );
      },
    });
  };

  const handleContactDelete = async (contact) => {
    const _contacts = [...contacts];
    const filteredContacts = _contacts.filter((c) => c !== contact);

    try {
      await userService.removeContact(contact);
      setContacts(filteredContacts);
    } catch (e) {
      console.log(e);
      if (e.response && e.response.status === 400) {
        // revert back
        return setContacts(_contacts);
        // add error message
      }
      return setContacts(_contacts);
    }

    console.log("Deleted");
  };

  return (
    <Fragment>
      <div className="container body">
        <Loading isLoading={isLoading} />
        {isSidebarVisible && (
          <Sidebar
            data={contactProfile}
            isOpen={isSidebarVisible}
            onClose={handleSidebarClose}
          />
        )}
        <div className="row">
          {contacts.length > 0 && (
            <Fragment>
              <div className="col-12 ">
                <h2 className="title my-4">Contacts</h2>
              </div>

              <div className="col-12 mb-4 col-lg-8">
                <div className=" float-right">
                  <input type="text" className="search" placeholder="search" />
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => setModalVisibility(true)}
                  >
                    Add New
                  </button>
                </div>
              </div>
            </Fragment>
          )}
          <div className="col-12">
            {contacts.length > 0 && (
              <table className="table table-hover table-border-none col-lg-8 ">
                <thead>
                  <tr>
                    <td>SN</td>
                    <td>NAMES</td>
                    <td>BIRTHDATE</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>
                        {user?.name?.firstName + " " + user?.name?.lastName ||
                          user?.name}
                      </td>
                      <td>
                        {typeof user.birthdate == "object"
                          ? user.birthdate.toDateString()
                          : user.birthdate}
                      </td>
                      <td>
                        <div className="button-group">
                          <button
                            className="btn btn-view btn-sm"
                            onClick={() => handleViewProfile(user.id)}
                          >
                            View Profile
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => confirmDelete(user)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {contacts.length === 0 && !isLoading && (
              <Fragment>
                <div className="text-center mt-5">
                  <p className="lead">
                    You do not have any contacts yet, add some.
                  </p>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => setModalVisibility(true)}
                  >
                    Add New
                  </button>
                </div>
              </Fragment>
            )}
          </div>
        </div>
      </div>
      <AddContact
        isVisible={isModalVisible}
        handleVisibility={handleModalVisibility}
      />
    </Fragment>
  );
};

export default Contact;
