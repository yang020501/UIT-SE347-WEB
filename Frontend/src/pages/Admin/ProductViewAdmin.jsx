import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ContentMain from '../../components/Admin/ContentMain'
import btnAction from '../../utils/btnAction'
import Card, { CardBody } from '../../components/Card'
import Form from 'react-bootstrap/Form'
import colors from '../../assets/fake-data/product-color'
import size from '../../assets/fake-data/product-size'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { apiUrl } from '../../utils/constant'
import { addProduct, updateProduct } from '../../redux/product/productsSlice'
import { setAlert } from '../../redux/alert-message/alertMessage'

const ProductViewAdmin = props => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { slug } = useParams();
  const productData = useSelector(state => state.productsSlice.value)
  const categoryData = useSelector(state => state.categorySlice.value)
  const token = useSelector(state => state.userState.token)
  const [color, setColor] = useState([])
  const [sizes, setSizes] = useState([])
  const [validated, setValidated] = useState(false);
  const [productForm, setproductForm] = useState({
    title: "",
    image1: "",
    image2: "",
    id_cate: "",
    categorySlug: "",
    colors: "",
    size: "",
    sale: 0,
    price: 0,
    description: " ",
    gender: 2,
    slug: "",
  })


  const { title, sale, price, descriptions, gender, categorySlug, image1, image2 } = productForm
  const onChange = e => {

    var file = e.target.files
    if (FileReader && file && file.length) {
      var fr = new FileReader();
      fr.onload = function () {
        // document.getElementById('avatar').childNodes[0].src = fr.result;
        setproductForm({
          ...productForm,
          [e.target.name]: fr.result,
        })
      }
      fr.readAsDataURL(file[0]);
    }
    else {
      setproductForm({
        ...productForm,
        [e.target.name]: e.target.value,
      })
    }

  }
  const setActiveColor = (itemActive) => {
    if (color.includes(itemActive)) {
      let list = color.filter(item => item !== itemActive)
      setColor([...list])
    }
    else {
      color.push(itemActive)
      setColor([...color])
    }
  }
  const setActiveSize = (itemActive) => {
    if (sizes.includes(itemActive)) {
      let list = sizes.filter(item => item !== itemActive)
      setSizes([...list])
    }
    else {
      sizes.push(itemActive)
      setSizes([...sizes])
    }
  }
  const clearValues = (type) => {
    if (type) {
      switch (type) {
        case "size": setSizes([])
        case "color": setColor([])
      }
    }
  }
  const check = () => {
    if (color.length === 0) {
      dispatch(setAlert({
        message: "Vui l??ng ch???n m??u s???c",
        type: "warning"
      }))
      return false
    }
    if (sizes.length === 0) {
      dispatch(setAlert({
        message: "Vui l??ng ch???n k??ch c???",
        type: "warning"
      }))
      return false
    }
    return true
  }
  const Update = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false || check() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    }
    else {
      setValidated(false)
      let categoryId = categoryData.find(item => item.slug === productForm.categorySlug) ? categoryData.find(item => item.slug === productForm.categorySlug).id : categoryData[0].id
      let type = productData.findIndex(item => item.id === productForm.id)
      let body = {
        ...productForm,
        category: categoryId ? categoryId : ""
      }
      if (type > -1 && slug !== "new") {
        let rs = await axios.post(`${apiUrl}/product/update-product`, body, { headers: { Authorization: `Bearer ${token}` } }).catch(data => { return data })
        if (rs.data) {
          dispatch(setAlert({
            message: "C???p nh???t s???n ph???m th??nh c??ng",
            type: "success"
          }))
          dispatch(updateProduct(productForm))
        }
        else {
          dispatch(setAlert({
            message: "C???p nh???t s???n ph???m th???t b???i ",
            type: "danger"
          }))
        }
      }
      else {
        let rs = await axios.post(`${apiUrl}/product/add-product`, body, { headers: { Authorization: `Bearer ${token}` } }).catch(data => { return data })

        if (rs.data) {
          dispatch(setAlert({
            message: "T???o s???n ph???m th??nh c??ng",
            type: "success"
          }))
          dispatch(addProduct(rs.data))
        }
        else {
          dispatch(setAlert({
            message: "L???i: T??n s???n ph???m ???? t???n t???i",
            type: "danger"
          }))
        }
      }
    }
  }
  useEffect(() => {
    setproductForm({
      ...productForm,
      colors: color.join(","),
      size: sizes.join(",")
    })
  }, [color, sizes])
  useEffect(() => {
    if (productData) {
      let product = productData.find((item) => {
        return item.slug === slug
      })
      if (product) {
        setColor(product.colors.split(","));
        setSizes(product.size.split(","))
        setproductForm({ ...product })
      }
    }
  }, [slug, productData])

  return (
    <Form noValidate validated={validated} onSubmit={Update}>
      <ContentMain headerTitle='S???n ph???m'
        headerLeftAction={{
          ...btnAction,
          title: 'Quay l???i S???n ph???m',
          action: () => navigate('/admin/product')
          // action: BacktoProducts
        }}
        headerRightAction={{
          ...btnAction,
          color: 'green',
          title: 'C??p nh???t',
          type: "submit",
          action: null
          // action: BacktoProducts
        }}
      >
        <Card>
          <CardBody>
            <fieldset className='border p-3'  >
              <legend className='float-none w-auto p-3'>{slug === "new" ? "T???o s???n ph???m m???i" : "Ch???nh s???a th??ng tin s???n ph???m"}</legend>
              <Form.Group className='me-5 mb-3'  >
                <Form.Label>T??n s???n ph???m</Form.Label>
                <Form.Control
                  required
                  type="text"
                  size="lg"
                  name="title"
                  value={title}
                  onChange={onChange}
                />
                <Form.Control.Feedback type="invalid">
                  Vui l??ng nh???p t??n s???n ph???m.
                </Form.Control.Feedback>
              </Form.Group>
              <div style={{ display: "flex", alignContent: "center", justifyContent: "center", width: "100%" }}>
                <Form.Group className='me-5 mb-3 w-100'  >
                  <Form.Label>Gi??</Form.Label>
                  <Form.Control
                    required
                    type="number"
                    size="lg"
                    name="price"
                    value={price}
                    onChange={onChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Vui l??ng nh???p gi??.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className='me-5 mb-3 w-100'  >
                  <Form.Label>Gi???i t??nh</Form.Label>
                  <div style={{ display: "flex", alignContent: "center", justifyContent: "space-around", width: "100%", marginTop: "10px" }}>
                    <Form.Check
                      type='radio'
                      label="Nam"
                      name="gender"
                      value={1}
                      onChange={onChange}
                      checked={gender == 1}
                    />
                    <Form.Check
                      type='radio'
                      label="N???"
                      name="gender"
                      value={0}
                      onChange={onChange}
                      checked={gender == 0}
                    />
                    <Form.Check
                      type='radio'
                      label="Unisex"
                      name="gender"
                      value={2}
                      onChange={onChange}
                      checked={gender == 2 || gender == null}
                    />
                  </div>
                </Form.Group>
              </div>
              <Form.Group className='me-5 mb-4' >
                <Form.Label>Lo???i s???n ph???m</Form.Label>
                <Form.Select
                  size="lg"
                  required
                  value={categorySlug}
                  name="categorySlug"
                  onChange={onChange}
                  bsPrefix="form-select form-select-lg"
                >
                  {
                    categoryData.map((item, index) => {
                      return (
                        <option key={index} value={item.slug} >{item.name}</option>
                      )
                    })
                  }
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Vui l??ng nh???p lo???i s???n ph???m.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className='me-5 mb-4' >
                <Form.Label>H??nh ???nh 1</Form.Label>
                <Form.Control

                  type="file"
                  // value={image1}
                  name="image1"
                  onChange={onChange}
                  size="lg"
                />
                <Form.Control.Feedback type="invalid">
                  Vui l??ng ch???n ???nh 1.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className='me-5 mb-4' >
                <Form.Label>H??nh ???nh 2</Form.Label>
                <Form.Control

                  type="file"
                  name="image2"
                  // value={image2}
                  onChange={onChange}
                  size="lg"
                />
                <Form.Control.Feedback type="invalid">
                  Vui l??ng ch???n ???nh 2.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className='me-5 mb-4' >
                <Form.Label>M??u s???c  <i className='bx bx-trash bx-tad ms-2 fs-5 ' style={{ cursor: 'pointer' }} onClick={() => clearValues("color")} /></Form.Label>
                <div className="product-info-item-list">
                  {
                    colors.map((item, index) => (
                      <div key={index} className={`product-info-item-list-item ${color.includes(item.color) ? 'active' : ""} `}
                        onClick={() => { setActiveColor(item.color) }}
                      >
                        {
                          <div className={`circle bg-${item.color}`}></div>
                        }
                      </div>
                    ))
                  }
                </div>
              </Form.Group>
              <Form.Group className='me-5 mb-4' >
                <Form.Label>K??ch c??? <i className='bx bx-trash bx-tad ms-2 fs-5' style={{ cursor: 'pointer' }} onClick={() => clearValues("size")} /></Form.Label>
                <div className="product-info-item-list">
                  {
                    <div className="product-info-item-list">
                      {size.map((item, index) => (
                        <div key={index} className={`product-info-item-list-item ${sizes.includes(item.size) ? 'active' : ''}`}
                          onClick={() => setActiveSize(item.size)}
                        >
                          <div className="product-info-item-list-item-size" >
                            {item.size}
                          </div>
                        </div>
                      ))
                      }
                    </div>
                  }
                </div>
              </Form.Group>
              <Form.Group className='me-5 mb-4' >
                <Form.Label>M?? t???</Form.Label>
                <Form.Control
                  as="textarea"
                  name="descriptions"
                  value={descriptions}
                  onChange={onChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Vui l??ng ghi m?? t???.
                </Form.Control.Feedback>
              </Form.Group>
            </fieldset>
          </CardBody>
        </Card>
      </ContentMain >
    </Form>
  )
}


export default ProductViewAdmin