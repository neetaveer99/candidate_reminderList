


import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  message,
  Table,
  Input,
  Button,
  Modal,
  Form,
  Space,
  DatePicker,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reminderModalVisible, setReminderModalVisible] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [candidateReminders, setCandidateReminders] = useState([]);
  const [viewReminderModalVisible, setViewReminderModalVisible] = useState(false);


  const [form] = Form.useForm(); // Hook for form instance

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/get_candidate");
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: "Candidate Name",
      dataIndex: ["candidate", "name"], // Adjust the property path based on the actual structure
      key: "candidate.name",
      responsive: ["xs", "sm"],
      align: "center",

    },
    {
      title: "Latest Reminder",
      dataIndex: "latestFutureReminder",
      key: "latestFutureReminder",
      render: (reminder) => {
        if (reminder) {
          const date = new Date(reminder.dateTime);
          return (
            <div>
              <div>{reminder.reminder}</div>
              <div>{date.toLocaleDateString()}</div>
            </div>
          );
        } else {
          return "No Reminder";
        }
      },
      align: "center",

    },
    
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <Space>
          <Button
          className="btn"
            icon={<PlusOutlined />}
            onClick={() => handleAddReminder(record)}
          >
            Add Reminder
          </Button>
          {/* <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>Delete</Button> */}
        </Space>
      ),
      align: "center",

    },
    {
      title: "View",
      dataIndex: "view",
      key: "view",
      render: (text, record) => (
        <Button icon={<EyeOutlined />} onClick={() => handleView(record)}>
          View
        </Button>
      ),
      responsive: ["md"],
      align: "center",

    },
  ];

  const handleAddReminder = (record) => {
    setSelectedCandidate(record);
    setReminderModalVisible(true);
  };

 

  const handleView = async (record) => {
    try {
      // Ensure that the record object has the expected structure
      if (record && record.candidate && record.candidate.name) {
        const response = await axios.get(
          `http://localhost:5000/get_reminders/${record.candidate._id}`
        );
        setCandidateReminders(response.data);
        setViewReminderModalVisible(true); // Use the new state variable
      } else {
        console.error("Invalid record structure:", record);
        message.error("Invalid record structure");
      }
    } catch (error) {
      console.error("Error fetching reminders:", error);
      message.error("Error fetching reminders");
    }
  };
  
 
  
  const hideViewReminderModal = () => {
    setViewReminderModalVisible(false);
  };
  

  const handleAddCandidate = async (values) => {
    try {
      // Make a POST request to add a new candidate
      const response = await axios.post(
        "http://localhost:5000/candidates",
        values
      );
      message.success("Candidate added successfully");
      setVisible(false); // Close the modal after successful submission

      form.resetFields();


      // Optionally, you can refresh the data by fetching it again
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            "http://localhost:5000/get_candidate"
          );
          setData(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
          message.error("Error fetching data");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } catch (error) {
      console.error("Error adding candidate:", error);
      message.error("Error adding candidate");
    }
  };

  const handleAddReminderSubmit = async (values) => {
    try {
      // Make a POST request to add a new reminder for the selected candidate
      const response = await axios.post(
        `http://localhost:5000/add_reminder/${selectedCandidate.candidate._id}`,
        values
      );
      message.success("Reminder added successfully");
      setReminderModalVisible(false);
      form.resetFields();


      // Optionally, you can refresh the data by fetching it again
      fetchData();
    } catch (error) {
      console.error("Error adding reminder:", error);
      message.error("Error adding reminder");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/get_candidate");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="home" id="home">
      <h1 className="">Candidates Info</h1>

      <Button
        icon={<PlusOutlined />}
        onClick={() => setVisible(true)}
        style={{ marginBottom: 16 }}

        className="btn"
      >
        Add Candidate
      </Button>
      <br />
      <Table
        dataSource={data}
        columns={columns}
        loading={loading}
        rowKey={(record) => record.candidate._id} 
        components={{
          header: {
            cell: (props) => (
              <th
                {...props}
                style={{
                  background: "black",
                  color: "white", 
                  fontWeight: 500,
                  fontSize: "17px",
                  textAlign: "center",
                }}
              />
            ),
          },
        }}
      />

      <Modal
        title="Add Candidate"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddCandidate}>
          <Form.Item
            label="Candidate Name"
            name="name" 
            rules={[
              { required: true, message: "Please enter the candidate name" },
            ]}
          >
            <Input />
          </Form.Item>

          

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Candidate
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Add Reminder for ${selectedCandidate?.candidate?.name}`}
        visible={reminderModalVisible}
        onCancel={() => setReminderModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddReminderSubmit}>
          <Form.Item
            label="Reminder"
            name="reminder"
            rules={[
              { required: true, message: "Please enter the reminder text" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Reminder Date"
            name="dateTime"
            rules={[
              { required: true, message: "Please enter the reminder date" },
            ]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Reminder
            </Button>
          </Form.Item>
        </Form>
      </Modal>





      <Modal
       title={`Reminders for ${selectedCandidate?.candidate?.name}`}
       visible={viewReminderModalVisible}
       onCancel={hideViewReminderModal}
       footer={null}
      >
        <Table
          dataSource={candidateReminders}
          columns={[
            {
              title: "Reminder",
              dataIndex: "reminder",
              key: "reminder",
            },
            {
              title: "Reminder Date",
              dataIndex: "dateTime",
              key: "dateTime",
              render: (dateTime) => new Date(dateTime).toLocaleDateString(),
            },
          ]}
          rowKey={(record) => record._id}
        />
      </Modal>
    </section>
  );
};

export default Home;
