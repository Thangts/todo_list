-- database/seed.sql
BEGIN;

-- Thêm user demo (password phải hash trong app; nếu chỉ demo có thể dùng plain, nhưng KHÔNG khuyến nghị)
INSERT INTO users (username, email, password)
VALUES ('demo', 'demo@example.com', 'demo-hashed-password')
ON CONFLICT (email) DO NOTHING;

-- Tạo board demo
INSERT INTO boards (name, owner_id)
VALUES ('Personal Board', 1)
ON CONFLICT DO NOTHING;

-- Thêm 2 task mẫu
INSERT INTO tasks (board_id, title, description, status, "order", start_date, due_date, category, priority, assignee_id)
VALUES
(1, 'Buy groceries', 'Milk, eggs, rice', 'todo', 1, '2025-09-24T09:00:00Z', '2025-09-25T23:59:59Z', 'shopping', 'low', 1),
(1, 'Finish report', 'Quarterly financial report', 'doing', 1, '2025-09-20T09:00:00Z', '2025-09-26T23:59:59Z', 'work', 'high', 1)
ON CONFLICT DO NOTHING;

-- Thêm tag & liên kết
INSERT INTO tags (name) VALUES ('urgent') ON CONFLICT DO NOTHING;
INSERT INTO task_tags (task_id, tag_id)
SELECT t.id, tg.id FROM tasks t JOIN tags tg ON tg.name = 'urgent' WHERE t.title = 'Finish report'
ON CONFLICT DO NOTHING;

COMMIT;
