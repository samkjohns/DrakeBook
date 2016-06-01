# == Schema Information
#
# Table name: users
#
#  id                 :integer          not null, primary key
#  username           :string           not null
#  password_digest    :string           not null
#  session_token      :string           not null
#  profile_photo_path :string           not null
#  cover_photo_path   :string           not null
#  birth_date         :date
#  workplace          :string
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#

class User < ActiveRecord::Base
  validates(
    :username,
    :password_digest,
    :session_token,
    :profile_photo_path,
    :cover_photo_path,
    presence: true
  )

  validates :username, :session_token, uniqueness: true
  validates :password, length: { minimum: 6, allow_nil: true }
  attr_reader :password

  after_initialize :ensure_session_token
  after_initialize :ensure_photos

  has_many(
    :requested_drakeships,
    class_name: "Drakeship",
    foreign_key: :requester_id
  )

  has_many :requested_drakes, through: :requested_drakeships, source: :recipient

  has_many(
    :received_drakeships,
    class_name: "Drakeship",
    foreign_key: :recipient_id
  )

  has_many :received_drakes, through: :received_drakeships, source: :requester

  # Auth methods
  def self.generate_session_token
    SecureRandom::urlsafe_base64
  end

  def self.find_by_credentials(username, password)
    user = User.find_by(username: username)
    return nil unless user
    user.is_password?(password) ? user : nil
  end

  def ensure_session_token
    self.session_token ||= self.class.generate_session_token
  end

  def password=(password)
    @password = password
    self.password_digest ||= BCrypt::Password.create(password)
  end

  def is_password?(password)
    BCrypt::Password.new(password_digest) == password
  end

  def reset_session_token
    self.session_token = self.class.generate_session_token
  end

  def ensure_photos
    self.profile_photo_path ||= "drake.png"
    self.cover_photo_path ||= "drake.png"
  end

  # Other
  def drakeships
    requested_drakes_sql = self.requested_drakes.to_sql
    received_drakes_sql = self.received_drakes.to_sql

    superquery = <<-SQL
      SELECT
        requested.* AND received.*
      FROM (
        :requested_drakes_subquery
      ) AS requested
      JOIN (
        :received_drakes_subquery
      ) received
    SQL

    self.class.find_by_sql
  end
end