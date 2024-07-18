import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CategoryDropdown = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 200px;
  max-height: 200px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }

  & option {
    padding: 10px;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  width: 400px;
`;

const SearchIcon = styled(FaSearch)`
  margin-right: 10px;
  color: #888;
`;

const SearchBar = styled.input`
  border: none;
  outline: none;
  width: 100%;
  font-size: 16px;
`;

const SortDropdown = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 200px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const ProductCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  transition: transform 0.15s ease;
  height: 100%; 
  display: flex;
  flex-direction: column; 

  &:hover {
    transform: scale(1.05);
  }
`;

const ProductImageContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProductImage = styled.img`
  max-width: 100%;
  max-height: 200px;
  object-fit: cover; 
  border-radius: 4px;
`;

const ProductContent = styled.div`
  padding: 10px;
`;

const ProductTitle = styled.h3`
  margin: 10px 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const ProductPrice = styled.p`
  font-weight: bold;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: ${({ isDiscounted }) => (isDiscounted ? '#2ecc71' : '#b80707')};
  font-size: ${({ isDiscounted }) => (isDiscounted ? '19px' : '16px')};
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #000;
`;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('');

  const categories = [
    'Meyve & Sebze', 
    'Et & Tavuk & Şarküteri', 
    'Süt & Süt Ürünleri', 
    'Kahvaltılık', 
    'Temel Gıda', 
    'Atıştırmalık', 
    'İçecek', 
    'Fırın & Pastane', 
    'Dondurulmuş Ürünler', 
    'Pasta Malzemeleri', 
    'Dondurma', 
    'Temizlik Ürünleri', 
    'Kişisel Bakım', 
    'Evcil Dostlar', 
    'Bebek'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000');
        console.log(response.data);
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filterProducts = () => {
      let filtered = [...products];
  
      if (searchTerm.trim() !== '') {
        filtered = filtered.filter((product) =>
          product.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
        );
      }
  
      if (selectedCategory) {
        filtered = filtered.filter((product) => product.category === selectedCategory);
      }
  
      filtered.forEach((product) => {
        const prices = [product.ig_price, product.cf_price, product.mg_price].filter(price => price !== null && !isNaN(price));
        product.price = prices.length > 0 ? Math.min(...prices) : null;
      });
  
      if (selectedSort === 'ascending') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (selectedSort === 'descending') {
        filtered.sort((a, b) => b.price - a.price);
      }
  
      setFilteredProducts(filtered);
    };
  
    filterProducts();
  }, [searchTerm, selectedCategory, selectedSort, products]);
  
  
  

  return (
    <div style={{ textAlign: 'center' }}>
      <Wrapper>
        <FilterContainer>
          {/*<CategoryDropdown
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </CategoryDropdown>*/}
          <SearchContainer>
            <SearchIcon />
            <SearchBar
              type="text"
              placeholder="Ürün arayın..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          <SortDropdown
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
          >
            <option value="">Sırala</option>
            <option value="ascending">Artan Fiyat</option>
            <option value="descending">Azalan Fiyat</option>
          </SortDropdown>
        </FilterContainer>
        <ProductGrid>
          {filteredProducts.map((product) => (
            <StyledLink to={`/${product.id}`} key={product.id}>
              <ProductCard>
                <ProductImageContainer>
                  <ProductImage
                    src={product.image_url}
                    alt={product.name}
                  />
                </ProductImageContainer>
                <ProductContent>
                  <ProductTitle>{product.name}</ProductTitle>
                  <ProductPrice>{product.price}₺</ProductPrice>
                </ProductContent>
              </ProductCard>
            </StyledLink>
          ))}
        </ProductGrid>
      </Wrapper>
    </div>
  );
};

export default Home;
