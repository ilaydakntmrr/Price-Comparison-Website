import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import istegelsinLogo from '../Pictures/istegelsin.jpg';
import carrefoursaLogo from '../Pictures/carrefoursa.png';
import migrosLogo from '../Pictures/migros.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons';

const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const ProductContainer = styled.div`
  flex-wrap: wrap;
  max-width: 800px;
  margin: 1% auto 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const ProductTopSection = styled.div`
  display: flex;
  align-items: flex-start;
`;

const ProductImage = styled.img`
  max-width: 300px;
  height: auto;
  border-radius: 8px;
  margin-right: 5%;
  margin-left: 5%;
`;

const ProductInfo = styled.div`
  margin:3%;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ProductName = styled.h2`
  margin-top: 5%;
  margin-bottom: 10px;
  font-size: 2.5em;
  color:#333330;
`;

const ProductPriceTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }

  th img, td img {
    max-width: 100px;
    height: auto;
  }

  a {
    display: block;
    text-decoration: none;
    color: inherit;
    
  }
`;

const HighlightedCell = styled.td`
  border-left: 5px solid green !important;
  border-right: 5px solid green !important;
  border-bottom: 5px solid green !important;
  font-weight: bold;
`;

const HighlightedHeaderCell = styled.th`
  border-left: 5px solid green !important;
  border-right: 5px solid green !important;
  border-top: 5px solid green !important;
`;

const ProductDescription = styled.p`
  margin-top: 20px;
  font-size: 1em;
`;

const ProductDescriptionTitle = styled.p`
  font-size: 2em;
  font-weight: bold;
  margin-top: 5%;
  margin-bottom: 0;
`;
const ReviewCountAndRating = styled.div`
  display: flex;
  align-items: baseline;
  margin-right: 5px; 
`;

const ReviewInfo = styled.div`
  display: flex;
  align-items: baseline;
  color: #333330;
  margin: 0;
`;
const ReviewCount = styled.p`
  font-size: 14px;
  margin-bottom: 5px;
  margin-left: 5px; 
`;
const AverageRating = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: #333330;
  margin-top: 0;
  margin-bottom: 1%;
  margin-right: 5px; 
`;

const StarRating = styled.div`
  display: flex;
  align-items: baseline; 
  font-size: 16px;
  margin-right: 5px;
  margin-bottom:1%;
  color: #ff9800;
`;
const StarIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
`;

const CommentContainer = styled.div`
  flex-wrap: wrap;
  max-width: 800px;
  margin: 1% auto 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const CommentBox = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
`;

const CommentUser = styled.p`
  font-weight: bold;
  margin-bottom: 5px;
`;

const CommentText = styled.p`
  margin-bottom: 10px;
`;
const CommentForm = styled.div`
  margin-top: 20px;
  padding: 20px;
  width:auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
`
const CustomAlertWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const CustomAlertMessage = styled.p`
  font-size: 16px;
  margin: auto;

`;
const CustomAlertCloseButton = styled.button`
  background-color: #4caf50;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
  display: block; 
`
const NonResizableTextarea = styled.textarea`
  width: 100%;
  resize: none; 
`;
;

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [stars, setStars] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentCount, setCommentCount] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [starIcons] = useState(Array.from({ length: 5 }, (_, index) => index + 1));
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/${productId}`);
        setProduct(response.data);
        
        if (response.data.comments) {
          setComments(response.data.comments);
        }
  
        const commentCountResponse = await axios.get(
          `http://localhost:5000/${productId}/comments/count`
        );
        setCommentCount(commentCountResponse.data.commentCount);
  
        if (response.data && response.data.ortalamaPuan) {
          const averageRating = parseFloat(response.data.ortalamaPuan);
          console.log('Ortalama Puan:', averageRating); 
  
          const fullStars = Math.floor(averageRating); 
          const decimalPart = averageRating - fullStars; 
  
          const starArray = Array.from({ length: 5 }, (_, index) => {
            if (index < fullStars) {
              
              return <StarIcon key={index} icon={faStar} style={{ color: '#ff9800' }} />;
            } else if (index === fullStars && decimalPart >= 0.5) {
              
              return <StarIcon key={index} icon={faStarHalf} style={{ color: '#ff9800' }} />;
            } else {
            
              return <StarIcon key={index} icon={faStar} style={{ color: '#ddd' }} />;
            }
          });
  
          setStars(starArray);
        } else {
          
          const greyStarArray = Array.from({ length: 5 }, (_, index) => (
            <StarIcon key={index} icon={faStar} style={{ color: '#ddd' }} />
          ));
          setStars(greyStarArray);
        }
  
      } catch (error) {
        console.error('Ürün verisi alınırken hata oluştu:', error);
      }
    };
  
    fetchProduct();
  }, [productId]);
  


  const CustomAlert = ({ message, onClose }) => {
    return (
      <CustomAlertWrapper>
        <CustomAlertMessage>{message}</CustomAlertMessage>
        <CustomAlertCloseButton onClick={onClose}>Kapat</CustomAlertCloseButton>
      </CustomAlertWrapper>
    );
  };
  const submitComment = async () => {
    try {
      if (selectedRating === 0) {
        setAlertMessage('Lütfen bir puan verin.');
        setShowAlert(true);
        return;
      }
      
      const response = await axios.post(`http://localhost:5000/${productId}/comments`, {
        productId,
        yazı: newComment,
        yorumPuani: selectedRating,
      });
      
      console.log('Yorum Eklenen Yanıt:', response.data);
  
      setComments([...comments, response.data]);
  
      setNewComment("");
      setSelectedRating(0);
  
      const updatedComments = [...comments, response.data];
      const totalRatings = updatedComments.reduce((sum, comment) => sum + comment.yorumPuani, 0);
      const newAverageRating = totalRatings / updatedComments.length;
      
      setProduct({
        ...product,
        ortalamaPuan: newAverageRating.toFixed(1), 
      });
  
      console.log('Güncellenmiş Ortalama Puan:', newAverageRating.toFixed(1));

      const newCommentCount = updatedComments.length;
      setCommentCount(newCommentCount);

      const fullStars = Math.floor(newAverageRating); 
      const decimalPart = newAverageRating - fullStars;
  
      const starArray = Array.from({ length: 5 }, (_, index) => {
        if (index < fullStars) {
          return <StarIcon key={index} icon={faStar} style={{ color: '#ff9800' }} />;
        } else if (index === fullStars && decimalPart >= 0.5) {
          return <StarIcon key={index} icon={faStarHalf} style={{ color: '#ff9800' }} />;
        } else {
          return <StarIcon key={index} icon={faStar} style={{ color: '#ddd' }} />;
        }
      });
  
      setStars(starArray);

      try {
        await axios.post(`http://localhost:5000/updateCommentCount`, {
          productId,
          newCommentCount,
        });
      } catch (error) {
        console.error('Yorum sayısı güncellenirken hata oluştu:', error);
      }
  
    } catch (error) {
      console.error('Yorum gönderilirken hata oluştu:', error);
    }
  };
  
  const parseDescription = (description) => {
    const sections = ['Pişirme önerisi', 'Kullanım Önerileri', 'İçindekiler', 'Üretici Firma', 'Menşei', 'Nasıl Muhafaza Edilmeli?', 'Besin Değerleri'];
    const parsedSections = [];

    let startIndex = 0;

    sections.forEach((section) => {
      const index = description.indexOf(section, startIndex);
      if (index !== -1) {
        parsedSections.push(description.substring(startIndex, index));
        startIndex = index;
      }
    });
    parsedSections.push(description.substring(startIndex));

    return parsedSections.filter(section => section.trim() !== '');
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  const { ig_price, cf_price, mg_price } = product;
  const prices = [ig_price, cf_price, mg_price];
  const minPrice = Math.min(...prices);

  const parsedDescription = parseDescription(product.description);

  return (
    <Wrapper>
      <ProductContainer>
        <ProductTopSection>
          {product.image_url && <ProductImage src={product.image_url} alt={product.name} />}
          <ProductInfo>
            <ProductName>{product.name}</ProductName>
            <ReviewInfo>
              <ReviewCountAndRating>
                <AverageRating>{product.ortalamaPuan}</AverageRating>
                <StarRating>{stars}</StarRating>
              </ReviewCountAndRating>
              <ReviewCount>{commentCount} Değerlendirme</ReviewCount>
            </ReviewInfo>



            <ProductPriceTable>
              <thead>
                <tr>
                  {prices.map((price, index) => (
                    price === minPrice ? (
                      <HighlightedHeaderCell key={index}>
                        <a href={
                          index === 0 ? product.ig_url :
                            index === 1 ? product.cf_url :
                              product.mg_url
                        } target="_blank" rel="noopener noreferrer">
                          <img src={
                            index === 0 ? istegelsinLogo :
                              index === 1 ? carrefoursaLogo :
                                migrosLogo
                          } alt={
                            index === 0 ? "istegelsin" :
                              index === 1 ? "carrefoursa" :
                                "migros"
                          } />
                        </a>
                      </HighlightedHeaderCell>
                    ) : (
                      <th key={index}>
                        <a href={
                          index === 0 ? product.ig_url :
                            index === 1 ? product.cf_url :
                              product.mg_url
                        } target="_blank" rel="noopener noreferrer">
                          <img src={
                            index === 0 ? istegelsinLogo :
                              index === 1 ? carrefoursaLogo :
                                migrosLogo
                          } alt={
                            index === 0 ? "istegelsin" :
                              index === 1 ? "carrefoursa" :
                                "migros"
                          } />
                        </a>
                      </th>
                    )
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {prices.map((price, index) => (
                    price === minPrice ? (
                      <HighlightedCell key={index}>
                        <a href={
                          index === 0 ? product.ig_url :
                            index === 1 ? product.cf_url :
                              product.mg_url
                        } target="_blank" rel="noopener noreferrer">
                          {price}
                        </a>
                      </HighlightedCell>
                    ) : (
                      <td key={index}>
                        <a href={
                          index === 0 ? product.ig_url :
                            index === 1 ? product.cf_url :
                              product.mg_url
                        } target="_blank" rel="noopener noreferrer">
                          {price}
                        </a>
                      </td>
                    )
                  ))}
                </tr>
              </tbody>
            </ProductPriceTable>
          </ProductInfo>
        </ProductTopSection>
        <ProductDescriptionTitle>Ürün Detayları:</ProductDescriptionTitle>
        {parsedDescription.map((section, index) => (
          <ProductDescription key={index}>{section}</ProductDescription>
        ))}
        <CommentBox>
          <h4>Yorum Ekleyin</h4>
          <CommentForm>
            <StarRating>
              {starIcons.map((star, index) => (
                <StarIcon
                  key={index}
                  icon={faStar}
                  style={{ color: index < selectedRating ? '#ff9800' : '#ddd' }}
                  onClick={() => setSelectedRating(index + 1)}
                />
              ))}
            </StarRating>
            <NonResizableTextarea
              rows="4"
              cols="50"
              placeholder="Yorumunuz..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <br /> <button onClick={submitComment}>Yorum Ekle</button>
          </CommentForm>
        </CommentBox>
        {showAlert && (
          <CustomAlert
            message={alertMessage}
            onClose={() => setShowAlert(false)}
          />
        )}
        {comments.map((comment) => (
          <CommentBox key={comment.yorumId}>
            <CommentUser style={{ fontFamily: 'Times New Roman, serif', display: 'flex', alignItems: 'center' }}>
              {comment.yazı ? (
                <>
                  {comment.yazı}
                  <div style={{ marginLeft: 'auto' }}>
                    {Array.from({ length: comment.yorumPuani }, (_, index) => (
                      <StarIcon key={index} icon={faStar} style={{ color: '#ff9800', fontSize: '12px' }} />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ marginRight: 'auto' }}>
                    {Array.from({ length: comment.yorumPuani }, (_, index) => (
                      <StarIcon key={index} icon={faStar} style={{ color: '#ff9800', fontSize: '12px' }} />
                    ))}
                  </div>
                </>
              )}
            </CommentUser>
            {comment.yorumYanit && (
              <>
                <CommentText style={{ backgroundColor: '#f2f2f2', fontSize: '12px', fontFamily: 'Times New Roman, serif' }}>
                  Değerlendirme: {comment.yorumYanit}
                </CommentText>
              </>
            )}
          </CommentBox>
        ))}
      </ProductContainer>

    </Wrapper>
  );
};

export default ProductDetail;