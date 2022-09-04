import { useCallback, useEffect, useState } from 'react';
import { MdAddCircle } from 'react-icons/md';
import Container from './Container';
import { Button, Cancel, Confirm, Error, Form, Input, Label, Textarea } from './RegistForm.style';
import SalesList from './SalesList';

const initSalesList = [{ index: 1, title: '', price: 0, quantity: 0 }];

const initInfo = {
  name: null,
  price: null,
  salePrice: null,
  from: null,
  isMd: false,
  isBest: false,
  detail: null,
};

const RegistForm = () => {
  const [info, setInfo] = useState(initInfo);
  const [errors, setErrors] = useState({});
  const [salesList, setSalesList] = useState(initSalesList);
  const [images, setImages] = useState([]);

  const changeHandler = ({ target: { name, value } }) => {
    setInfo(state => ({ ...state, [name]: value }));
  };
  const checkHandler = ({ target: { name, checked } }) => {
    setInfo(state => ({ ...state, [name]: checked }));
  };
  const changeImageHandler = ({ target: { files } }) => {
    validateField('images', files.length, ['IMAGES']);
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = ({ target: { result } }) => {
        setImages(state => [...state, result]);
      };
      reader.onerror = e => {
        console.error(`Error: ${e}`);
      };
    });
  };

  const addSalesHandler = () => {
    setSalesList(state => {
      const newIndex = state.reduce(
        (prev, curr) => (prev.index > curr.index ? prev.index : curr.index) + 1,
        {
          index: 0,
        }
      );
      return [...state, { index: newIndex, title: '', price: 0, quantity: 0 }];
    });
  };

  const changeSalesHandler = useCallback(
    index =>
      ({ target: { name, value } }) => {
        setSalesList(state => {
          const list = [...state];
          const targetIndex = state.findIndex(item => item.index === index);
          list[targetIndex][name] = value;
          return list;
        });
      },
    []
  );

  const deleteSalesHandler = useCallback(index => {
    setSalesList(state => state.filter(item => item.index !== index));
  }, []);

  const submitHandler = e => {
    e.preventDefault();

    //TEST CODE
    alert(JSON.stringify({ ...info, salesList, images }));
  };

  const blurHandler =
    options =>
    ({ target: { name, value } }) => {
      validateField(name, value, options);
    };

  const validateField = (name, value, options) => {
    let message = '';
    options.some(option => {
      switch (option) {
        case 'REQUIRED':
          message = value ? null : '필수 입력항목입니다.';
          break;
        case 'CURRENCY':
          message = value > 0 ? null : '금액은 1원 이상 입력해야 합니다.';
          break;
        case 'QUANTITY':
          message = value > 0 ? null : '수량은 1개 이상 입력해야 합니다.';
          break;
        case 'SALES':
          message = value > 0 ? null : '판매목록은 1개 이상 입력해야 합니다.';
          break;
        case 'IMAGES':
          message = value > 0 ? null : '이미지는 1개 이상 첨부해야 합니다.';
          break;
      }

      if (message) return true;
    });

    const error = message ? { [name]: message } : null;
    setErrors(state => {
      if (error) return { ...state, ...error };
      else {
        const temp = { ...state };
        delete temp[name];
        return temp;
      }
    });
  };

  useEffect(() => {
    validateField('salesList', salesList.length, ['SALES']);
  }, [salesList]);

  return (
    <Form onSubmit={submitHandler}>
      <Container>
        <Label>상품명</Label>
        <Input
          type="text"
          name="name"
          autoFocus
          onChange={changeHandler}
          onBlur={blurHandler(['REQUIRED'])}
        />
        {<Error>{errors.name}</Error> || null}
      </Container>

      <Container>
        <Label>대표 가격</Label>
        <Input
          type="number"
          name="price"
          onChange={changeHandler}
          onBlur={blurHandler(['REQUIRED', 'CURRENCY'])}
        />
        {<Error>{errors.price}</Error> || null}
      </Container>
      <Container>
        <Label>대표 할인 가격</Label>
        <Input
          type="number"
          name="salePrice"
          min="1"
          onChange={changeHandler}
          onBlur={blurHandler(['REQUIRED', 'CURRENCY'])}
        />
        {<Error>{errors.salePrice}</Error> || null}
      </Container>

      <Container>
        <Label>원산지</Label>
        <Input type="text" name="from" onChange={changeHandler} />
      </Container>

      <Container>
        <Label>
          MD
          <Input type="checkbox" name="isMd" onChange={checkHandler} />
        </Label>

        <Label>
          BEST
          <Input type="checkbox" name="isBest" onChange={checkHandler} />
        </Label>
      </Container>

      <Container>
        <Label>상세정보</Label>
        <Textarea name="detail" rows="10" style={{ resize: 'none' }} onChange={changeHandler} />
      </Container>

      <Container>
        <Label>이미지</Label>
        <Input type="file" multiple accept="image/*" onChange={changeImageHandler} />
        {<Error>{errors.images}</Error> || null}
      </Container>

      <Container>
        <Label>
          판매목록
          <Button type="button" onClick={addSalesHandler}>
            <MdAddCircle size="20" color="#42855B" />
          </Button>
        </Label>

        <SalesList
          list={salesList}
          changeHandler={changeSalesHandler}
          deleteHandler={deleteSalesHandler}
        />
        {<Error>{errors.salesList}</Error> || null}
      </Container>

      <Confirm type="submit" disabled={Object.keys(errors).length === 0 ? true : false}>
        등록
      </Confirm>
      <Cancel type="button">취소</Cancel>
    </Form>
  );
};

export default RegistForm;
