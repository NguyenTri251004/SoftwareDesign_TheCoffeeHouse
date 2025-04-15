import tensorflow as tf
import tensorflow_recommenders as tfrs
import pandas as pd
import json

# Đọc file JSON
with open("data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Tạo DataFrame
df_users = pd.DataFrame(data["users"])
df_products = pd.DataFrame(data["products"])
df_interactions = pd.DataFrame(data["interactions"])

# Chuyển đổi kiểu dữ liệu
df_interactions["user_id"] = df_interactions["user_id"].astype(str)
df_interactions["product_id"] = df_interactions["product_id"].astype(str)

# Tạo dataset
data_dict = df_interactions[["user_id", "product_id"]].to_dict(orient="list")
dataset = tf.data.Dataset.from_tensor_slices(data_dict).shuffle(10).batch(32).cache()

# Danh sách unique user và product
user_ids = df_interactions["user_id"].unique()
product_ids = df_interactions["product_id"].unique()

# In số lượng để kiểm tra
print(f"Number of unique users: {len(user_ids)}")
print(f"Number of unique products: {len(product_ids)}")
print(f"Number of interactions: {len(df_interactions)}")

# Xây dựng embedding
user_model = tf.keras.Sequential([
    tf.keras.layers.StringLookup(vocabulary=user_ids, mask_token=None),
    tf.keras.layers.Embedding(input_dim=len(user_ids) + 1, output_dim=32,
                              embeddings_regularizer=tf.keras.regularizers.l2(0.001))
])

item_model = tf.keras.Sequential([
    tf.keras.layers.StringLookup(vocabulary=product_ids, mask_token=None),
    tf.keras.layers.Embedding(input_dim=len(product_ids) + 1, output_dim=32,
                              embeddings_regularizer=tf.keras.regularizers.l2(0.001))
])

# Chuẩn bị candidates và chuyển thành tensor
candidates_dataset = (tf.data.Dataset.from_tensor_slices(product_ids)
                      .batch(128)
                      .map(item_model))
candidates_tensor = tf.concat(list(candidates_dataset), axis=0)

# Định nghĩa mô hình TFRS
class RecommendationModel(tfrs.Model):
    def __init__(self, user_model, item_model):
        super().__init__()
        self.user_model = user_model
        self.item_model = item_model
        self.task = tfrs.tasks.Retrieval()

    def compute_loss(self, features, training=False):
        user_embeddings = self.user_model(features["user_id"])
        item_embeddings = self.item_model(features["product_id"])
        return self.task(user_embeddings, item_embeddings)

# Khởi tạo và huấn luyện mô hình
model = RecommendationModel(user_model, item_model)
model.compile(optimizer=tf.keras.optimizers.Adagrad(learning_rate=0.15))
model.fit(dataset, epochs=1000)

# Tạo index để truy vấn
index = tfrs.layers.factorized_top_k.BruteForce(model.user_model)
index.index(candidates_tensor)

# Tạo gợi ý cho tất cả người dùng và lưu vào file
recommendations = {}
for user_id in user_ids:
    scores, top_k_indices = index(tf.constant([user_id]), k=5)
    recommended_indices = top_k_indices.numpy()[0]
    recommended_products = [product_ids[i] for i in recommended_indices]
    recommendations[user_id] = recommended_products

# Lưu gợi ý vào file JSON
with open("recommendations.json", "w", encoding="utf-8") as f:
    json.dump(recommendations, f, ensure_ascii=False, indent=4)

print("Đã lưu gợi ý vào recommendations.json")