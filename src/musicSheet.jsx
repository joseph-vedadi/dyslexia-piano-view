import React, { useEffect, useState } from 'react'
import { Row, Col, Container } from 'react-bootstrap';
import Carousel, { slidesToShowPlugin } from '@brainhubeu/react-carousel';
export const MusicSheet = () => {


  return <Container>
    <Row>
      <Col>
        <Carousel
          plugins={[
            'arrows',
            {
              resolve: slidesToShowPlugin,
              options: {
                numberOfSlides: 3
              }
            },
          ]}

        >
          <img src="https://www.ikea.com/us/en/images/products/smycka-artificial-flower-rose-red__0903311_pe596728_s5.jpg" />
          <img src="https://www.ikea.com/us/en/images/products/smycka-artificial-flower-rose-red__0903311_pe596728_s5.jpg" />
          <img src="https://www.ikea.com/us/en/images/products/smycka-artificial-flower-rose-red__0903311_pe596728_s5.jpg" />
        </Carousel>
      </Col>
    </Row>

  </Container>



}

export default MusicSheet





