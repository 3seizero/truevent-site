CREATE TABLE IF NOT EXISTS forms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  event VARCHAR(50) NOT NULL,
  edition YEAR NOT NULL,
  form_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_event_edition (event, edition)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  form_id INT NOT NULL,
  respondent_name VARCHAR(255),
  respondent_email VARCHAR(255),
  respondent_company VARCHAR(255),
  respondent_role ENUM('buyer', 'exhibitor', 'partner', 'other') DEFAULT 'other',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT,
  FOREIGN KEY (form_id) REFERENCES forms(id),
  INDEX idx_form_date (form_id, submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  submission_id INT NOT NULL,
  question_key VARCHAR(50) NOT NULL,
  question_text TEXT NOT NULL,
  answer_type ENUM('rating', 'text') NOT NULL,
  answer_rating TINYINT NULL,
  answer_text TEXT NULL,
  FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
  INDEX idx_submission (submission_id),
  INDEX idx_question (question_key, answer_rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS email_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  submission_id INT,
  recipient VARCHAR(255) NOT NULL,
  email_type ENUM('admin_notification', 'autoresponder') NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('sent', 'failed') NOT NULL,
  error_message TEXT NULL,
  FOREIGN KEY (submission_id) REFERENCES submissions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Initial form
INSERT INTO forms (slug, event, edition, form_type, title) VALUES
('puglia-2026-feedback', 'puglia', 2026, 'feedback', 'TRUE Puglia 2026');

-- Initial admin user (password: TrueAdmin2026!)
-- Change this password after first login
INSERT INTO admin_users (username, password_hash) VALUES
('admin@truevent.eu', '$2y$10$xKQr5p5pHGJxOqV0bKhCQOqQq3ZjYqe7xVYwJZjN8K1vR3jT.p6Wy');
