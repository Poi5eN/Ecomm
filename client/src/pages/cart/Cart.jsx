import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../components/Layout'
import { DeleteOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Select, Table } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import { response } from 'express';

const Cart = () => {

    const [subTotal, setSubTotal] = useState(0);
    const [billPopUp, setBillPopUp] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {cartItems} = useSelector(state => state.rootReducer);

    const handlerIncrement = (record) => {
        dispatch({
            type: "UPDATE_CART",
            payload: {...record, quantity: record.quantity + 1}
        });
    };

    const handlerDecrement = (record) => {
        if(record.quantity !== 1){
            dispatch({
                type: "UPDATE_CART",
                payload: {...record, quantity: record.quantity - 1}
            });
        }
    };

    const handlerDelete = (record) => {
        dispatch({
            type: "DELETE_FROM_CART",
            payload: record
        });
    }

    const columns = [
        {
            title: "Name",
            dataIndex: "name"
        },
        {
            title: "Image",
            dataIndex: "image",
            render:(image, record) => <img src={image} alt={record.name} height={60} width={60} />
        }, 
        {
            title: "Price",
            dataIndex: "price",
        }
        , 
        {
            title: "Quantity",
            dataIndex: "_id",
            render:(id, record) => 
                <div>
                    <MinusCircleOutlined className='cart-minus' onClick={() => handlerDecrement(record)}/>
                    <strong className='cart-quantity'>{record.quantity}</strong>
                    <PlusCircleOutlined className='cart-plus' onClick={() => handlerIncrement(record)} />
                </div>
        }
        , 
        {
            title: "Action",
            dataIndex: "_id",
            render:(id, record) => <DeleteOutlined className='cart-action' onClick={() => handlerDelete(record)} />
        }
    ]

    useEffect(() => {

        let temp = 0;
        console.log("cartItems", cartItems);
        cartItems.forEach((product) => {
          const stringWithoutComma = product.price.replace(/,/g, '');
          temp = temp + Number(stringWithoutComma) * product.quantity
        });
        setSubTotal(temp); 

    }, [cartItems]);

    // const handlerSubmit = async(value) => {
    //     //console.log(value);
    //     try {


    //         const newObject = {
    //             ...value,
    //             cartItems,
    //             subTotal,
    //             tax: Number(((subTotal / 100) * 10).toFixed(2)),
    //             totalAmount: Number((Number(subTotal) + Number(((subTotal / 100) * 10).toFixed(2))).toFixed(2)),
    //             userId: JSON.parse(localStorage.getItem("auth"))._id
    //         }

    //         console.log(newObject);
    //         console.log("is point par sahi hai");

    //         await axios.post("/api/bills/addbills", newObject);

    //         message.success("Bill Generated!");
    //         navigate("/bills");
    //     } catch(error) {
    //         // message.error("Error!")
    //         // console.log(error);
    //         console.log("Problem hai");
    //     }
    // }

    // const handlerSubmit = async (value) => {
    //   try {
    //     const newObject = {
    //       ...value,
    //       cartItems,
    //       subTotal,
    //       tax: Number(((subTotal / 100) * 10).toFixed(2)),
    //       totalAmount: Number((Number(subTotal) + Number(((subTotal / 100) * 10).toFixed(2))).toFixed(2)),
    //       userId: JSON.parse(localStorage.getItem("auth"))._id
    //     };
    //     console.log('here')
    
    //     const response = await axios.post("/api/bills/addbills", newObject);
    //     console.log("data here", response);
        
    //     message.success("Bill Generated!");
    //     navigate("/bills");
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };


    const handlerSubmit = async (value) => {
      console.log('value',value)
      console.log('cartItems',cartItems)
      let totalAmount = cartItems.reduce((acc,item)=>{ 
        const stringWithoutComma = item.price.replace(/,/g, '');
              return acc + Number(stringWithoutComma)
      },0)

      console.log('subTotal',totalAmount)
      const newObject = {
        ...value,
        cartItems,
        subTotal: totalAmount,
        tax: Number(((totalAmount / 100) * 10).toFixed(2)),
        totalAmount: Number((Number(totalAmount) + Number(((totalAmount / 100) * 10).toFixed(2))).toFixed(2)),
        userId: JSON.parse(localStorage.getItem("auth"))._id
      };
      // console.log(newObject.subTotal)

      axios.post("/api/bills/addbills", newObject)
      .then((res) => {
        console.log("Successfully created", res);

          message.success("Bill Generated!");
          navigate("/bills");

      })
      .catch((err) => {
          console.log("Error is: ", err);
      }) 
    };


    

  return (
    <Layout>
      <h2>Cart</h2>
      <Table dataSource={cartItems} columns={columns} bordered />
      <div className="subTotal">
        <h2>Sub Total: <span> {(subTotal).toFixed(2)} </span></h2>
        <Button onClick={() => setBillPopUp(true)} className='add-new'>Create Invoice</Button>
      </div>
      <Modal title="Create Invoice" visible={billPopUp} onCancel={() => setBillPopUp(false)} footer={false}>
        <Form layout='vertical' onFinish={handlerSubmit}>
            <FormItem name="customerName" label="Customer Name">
              <Input/>
            </FormItem>
            <FormItem name="customerPhone" label="Customer Phone">
              <Input/>
            </FormItem>
            <FormItem name="customerAddress" label="Customer Address">
              <Input/>
            </FormItem>
            <Form.Item name="paymentMethod" label="Payment Method">
              <Select>
                <Select.Option value="cash">Cash</Select.Option>
                <Select.Option value="paypal">Paypal</Select.Option>
                <Select.Option value="Card">Card</Select.Option>
              </Select>
            </Form.Item>
            <div className="total">
                <span>SubTotal: $100{(subTotal.toFixed(2))}</span><br />
                <span>Tax: $2{((subTotal / 100) * 10).toFixed(2)}</span>
                <h3>Total: $102{(Number(subTotal) + Number(((subTotal / 100) * 10).toFixed(2))).toFixed(2)}</h3>
            </div>
            <div className="form-btn-add">
              <Button htmlType='submit'  onClick={handlerSubmit} className='add-new'>Create Invoice</Button>
            </div>  
        </Form>
      </Modal>
    </Layout>
  )
}

export default Cart
