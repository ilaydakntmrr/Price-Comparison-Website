const express = require('express');
const db = require('./db'); 
const app = express();
const port = 5000;
const { connectToDatabase, closeDatabaseConnection, executeQuery } = require("./db")
const cors = require('cors');
app.use(cors());
app.use(express.json());
connectToDatabase();

// Tüm ürünleri getiren endpoint
app.get("/", async (req, res) => {
  try {
    const query = `
      SELECT id, name, image_url, ROUND(ig_price, 2) AS ig_price, ROUND(cf_price, 2) AS cf_price, ROUND(mg_price, 2) AS mg_price
      FROM products;
    `;
    const products = await executeQuery(query);

    // Kontrol için konsola yazdırma
    console.log("Fetched products:", products);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get("/:urunId", async (req, res) => {
  try {
    const productId = req.params.urunId;
    const query = `
      SELECT id, name, image_url, 
             ROUND(ig_price, 2) AS ig_price, 
             ROUND(cf_price, 2) AS cf_price, 
             ROUND(mg_price, 2) AS mg_price, 
             ig_url, cf_url, mg_url,
             description
      FROM products 
      WHERE id = ${productId};
    `;
    const urun = await executeQuery(query);

    if (urun.length === 0) {
      // Ürün bulunamadıysa
      res.status(404).json({ error: "Product not found" });
    } else {
      const queryYorum = `
        SELECT AVG(yorumPuani) AS ortalamaPuan FROM Yorum WHERE urunId = ${productId};
      `;
      const yorumOrtalamasi = await executeQuery(queryYorum);

      const ortalamaPuan = yorumOrtalamasi[0].ortalamaPuan || 0; // Ortalama puan varsa al, yoksa 0 olarak ata

      const queryYorumlar = `SELECT * FROM Yorum WHERE urunId = ${productId};`;
      const yorumlar = await executeQuery(queryYorumlar);

      const productWithComments = {
        ...urun[0],
        ortalamaPuan: ortalamaPuan, // Ortalama puanı ekle
        comments: yorumlar,
      };

      res.json(productWithComments);
      console.log(productWithComments);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Login endpoint'i
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Eğer giriş bilgileri doğru ise kullanıcıyı bul ve giriş yap
    const query = `
      SELECT * FROM Kullanici
      WHERE eposta = '${email}' AND sifre = '${password}';
    `;
    const users = await executeQuery(query);

    if (users.length === 1) {
      // Başarılı giriş
      const user = users[0];
      const userId = parseInt(user.kullaniciId); // Kullanıcı ID'sini int'e dönüştür
      console.log("Kullanıcı ID:", userId);
      res.status(200).json({
        success: true,
        message: "Giriş başarılı",
        userId: userId,
      });
    } else {
      // Hatalı giriş
      res.status(401).json({ success: false, error: "Email veya şifre hatalı" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/reset-password", async (req, res) => {
  try {
    const { ad, soyad, eposta, yeniSifre } = req.body;

    // Kullanıcıyı bul ve gelen bilgilerle eşleşip eşleşmediğini kontrol et
    const userQuery = `
      SELECT * FROM Kullanici
      WHERE ad = '${ad}' AND soyad = '${soyad}' AND eposta = '${eposta}';
    `;
    const users = await executeQuery(userQuery);

    if (users.length === 1) {
      // Kullanıcı bulunduysa şifreyi güncelle
      const updatePasswordQuery = `
        UPDATE Kullanici
        SET sifre = '${yeniSifre}'
        WHERE ad = '${ad}' AND soyad = '${soyad}' AND eposta = '${eposta}';
      `;
      await executeQuery(updatePasswordQuery);

      res.status(200).json({ success: true, message: "Şifre başarıyla güncellendi" });
    } else {
      // Kullanıcı bulunamadı veya giriş bilgileri hatalı
      res.status(401).json({ success: false, error: "Giriş bilgileri hatalı" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { fullName, lastName, email, password } = req.body;

    const checkEmailQuery = `
      SELECT * FROM Kullanici
      WHERE eposta = '${email}';
    `;
    const existingUsers = await executeQuery(checkEmailQuery);

    if (existingUsers.length > 0) {

      res.status(409).json({ success: false, error: "Email already exists" });
    } else {
      const insertUserQuery = `
        INSERT INTO Kullanici (ad, soyad, eposta, sifre) 
        VALUES 
        ('${fullName}', '${lastName}', '${email}', '${password}');
      `;
      await executeQuery(insertUserQuery);

      res.status(200).json({ success: true, message: "Kayıt başarılı" });
    }
  } catch (error) {
    console.error('Error during sign up:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post("/:urunId/comments", async (req, res) => {
  try {
    console.log('Gelen İstek:', req.body);

    const productId = req.params.urunId;
    const { yazı, yorumPuani, yorumYanit } = req.body;

    console.log('Gelen Yorum:', yazı);

    const query = `
      INSERT INTO Yorum (yazı, yorumPuani, urunId) 
      VALUES 
      (${yazı ? `'${yazı}'` : 'null'}, ${yorumPuani || 'null'}, ${productId});
    `;

    await executeQuery(query);

  console.log('Yorum sayısı güncellendi');const insertedCommentQuery = `
  SELECT * 
  FROM Yorum 
  WHERE urunId = ${productId} 
  AND id = SCOPE_IDENTITY();
`;

const insertedComment = await executeQuery(insertedCommentQuery);
console.log('Eklenen Yorum:', insertedComment[0]);

res.status(201).json(insertedComment[0]);
} catch (error) {
console.error('Error adding comment:', error);
res.status(500).json({ error: 'Internal Server Error', details: error.message });
}
});

app.get("/:urunId/comments/count", async (req, res) => {
  try {
    const productId = req.params.urunId;
    const query = `
      SELECT COUNT(*) AS commentCount FROM Yorum
      WHERE urunId = ${productId};
    `;
    const commentCount = await executeQuery(query);

    res.json(commentCount[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post('/updateCommentCount', async (req, res) => {
  const { productId, newCommentCount } = req.body;

  try {
    await sql.connect(config);
    const query = `
      UPDATE Puan
      SET yorumSayisi = ${newCommentCount}
      WHERE productId = ${productId}
    `;

    const result = await sql.query(query, {
      newCommentCount: sql.Int,
      productId: sql.Int,
    }, {
      newCommentCount,
      productId,
    });

    await sql.close();
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      res.status(200).send('Yorum sayısı güncellendi');
    } else {
      res.status(404).send('Ürün bulunamadı');
    }
  } catch (error) {
    console.error('Error updating comment count:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post("/SupportForm", async (req, res) => {
  try {
    const { email, suggestions } = req.body;

    const query = `
      INSERT INTO Oneri (eposta, oneri)
      VALUES 
      (${email ? `'${email}'` : 'null'}, ${suggestions ? `'${suggestions}'` : 'null'});
    `;

    await executeQuery(query);

    console.log(`Yeni destek formu gönderildi:\nE-posta: ${email}\nÖneriler: ${suggestions}`);
    
    res.status(200).json({ message: "Destek formu başarıyla gönderildi" });
  } catch (error) {
    console.error('Form gönderilirken bir hata oluştu:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/account-settings', async (req, res) => {
  try {
    const query = `
      SELECT ad, soyad, eposta,sifre
      FROM Kullanici
      WHERE kullaniciId = ${userId}; 
    `;
    console.log({userId})
    const users = await executeQuery(query);

    if (users.length === 1) {
      const user = users[0];
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} üzerinde çalışıyor`);
});
