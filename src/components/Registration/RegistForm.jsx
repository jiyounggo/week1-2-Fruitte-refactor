import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import Container from './Container';
import SalesList from './SalesList';

const Form = styled.form`
  padding-left: 20%;
  padding-right: 20%;
`;

const Error = styled.span`
  font-size: 14px;
  color: red;
`;

const initInfo = {
  name: null,
  price: null,
  salePrice: null,
  from: null,
  isMd: false,
  isBest: false,
  detail: null,
};

const initSalesList = [{ index: 1, title: '', price: 0, quantity: 0 }];

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
        <label>상품명</label>
        <input
          type="text"
          name="name"
          autoFocus
          onChange={changeHandler}
          onBlur={blurHandler(['REQUIRED'])}
        />
        {<Error>{errors.name}</Error> || null}
      </Container>

      <Container>
        <label>대표 가격</label>
        <input
          type="number"
          name="price"
          min="1"
          onChange={changeHandler}
          onBlur={blurHandler(['REQUIRED', 'CURRENCY'])}
        />
        {<Error>{errors.price}</Error> || null}
      </Container>
      <Container>
        <label>대표 할인 가격</label>
        <input
          type="number"
          name="salePrice"
          min="1"
          onChange={changeHandler}
          onBlur={blurHandler(['REQUIRED', 'CURRENCY'])}
        />
        {<Error>{errors.salePrice}</Error> || null}
      </Container>

      <Container>
        <label>원산지</label>
        <input type="text" name="from" onChange={changeHandler} />
      </Container>

      <Container>
        <label>
          MD
          <input type="checkbox" name="isMd" onChange={checkHandler} />
        </label>

        <label>
          BEST
          <input type="checkbox" name="isBest" onChange={checkHandler} />
        </label>
      </Container>

      <Container>
        <label>상세정보</label>
        <textarea name="detail" rows="10" style={{ resize: 'none' }} onChange={changeHandler} />
      </Container>

      <Container>
        <label>이미지</label>
        <input type="file" multiple accept="image/*" onChange={changeImageHandler} />
        {<Error>{errors.images}</Error> || null}
      </Container>

      <Container>
        <label>
          판매목록
          <button type="button" onClick={addSalesHandler}>
            추가
          </button>
        </label>

        <SalesList
          list={salesList}
          changeHandler={changeSalesHandler}
          deleteHandler={deleteSalesHandler}
        />
        {<Error>{errors.salesList}</Error> || null}
      </Container>

      <button type="submit" disabled={errors}>
        등록
      </button>
      <button type="button">취소</button>
    </Form>
  );
};

export default RegistForm;
