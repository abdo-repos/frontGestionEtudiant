import React, { useState, useEffect } from "react";
import { Form, Input, Button, PageHeader, Select, message } from "antd";
import { PostUsers } from "../../store/actions/usersAction";
import "../../style/Admin.css";
import axios from "axios";
import URL from '../../config/config'

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 8,
  },
};
const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

const AddUser = (props) => {
  const [cin, setCin] = useState();
  const [niveau, setNiveau] = useState([]);
  const [idNiveau, setIdNiveau] = useState(0);
  const [semestre, setSemestre] = useState("");

  const { type, label } = props;

  const onSubmit = (e) => {
    if (type === "SEMESTRE") {
      axios({
        method: "post",
        url: `${URL}/api/semester/`,
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        data: {
          niveau: idNiveau.toString(),
          libelle: semestre,
        },
      }).then((res) => message.success("Semestre Added"))
      .catch((err) => message.error(err.response.data.message));;
    }
    if (type === "USER") {
      axios({
        method: "post",
        url: `${URL}/api/users/add`,
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        data: {
          cin: cin,
          idNiveau: idNiveau.toString(),
          role: props.role,
        },
      }).then((res) => message.success("User Added"))
      .catch((err) => message.error(err.response.data.message));;
    }
  };
  useEffect(async () => {
    const res = axios({
      method: "get",
      url: `${URL}/api/niveau/list`,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => {
        let tab = [];
        console.log(res.data);
        res.data.map((elm) =>
          tab.push({ id: elm.id, libelle: elm.descNiveau })
        );
        setNiveau(tab);
      })
      .catch((err) => console.log(err));
  }, []);
  const handleChange = (e) => {
    if (type === "USER") setCin(e.target.value);
    if (type === "SEMESTRE") setSemestre(e.target.value);
  };
  return (
    <div>
      <PageHeader
        className="site-page-header"
        //onBack={() => null}
        title="AJOUTER"
        subTitle={props.role}
      />
      <div className="container">
        <Form
          {...layout}
          name="nest-messages"
          onFinish={onSubmit}
          validateMessages={validateMessages}
        >
          <Form.Item
            label={label}
            name={label.toLowerCase()}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input onChange={handleChange} />
          </Form.Item>
          {(props.role === "STUDENT" || type === "SEMESTRE") && (
            <Form.Item
              label="NIVEAU"
              name="niveau"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                defaultValue=""
                //style={{ width: 120 }}
                onChange={(id) => setIdNiveau(id)}
                options={
                  niveau.length !== 0 &&
                  niveau.map((elm) => ({ label: elm.libelle, value: elm.id }))
                }
              />
            </Form.Item>
          )}
          {type === "USER" && (
            <Form.Item
              label="Role"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input size="middle" readOnly value={props.role} />
            </Form.Item>
          )}
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
            <Button type="primary" htmlType="submit">
              Ajouter
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddUser;
