import React from 'react';
import LeftSection from './LeftSection/LeftSection';
import MyInfo from './MyInfo/MyInfo';
import OrderTable from './OrderTable/OrderTable';
import { Section, Container, RightSection, H2 } from './OrderDetail.style';

const OrderDetail = () => {
  return (
    <Section>
      <Container>
        <LeftSection />
        <RightSection>
          <MyInfo />
          <H2>주문 조회</H2>
          <OrderTable />
        </RightSection>
      </Container>
    </Section>
  );
};

export default OrderDetail;
