class Api::UsersController < ApplicationController
  def create
    @user = User.new(user_params)

    if @user.save
      login @user
      render :profile
    else
      render(
        json: { errors: @user.errors.full_messages },
        status: 422
      )
    end
  end

  def show
    @user = User.find(params[:id])
    render :profile
  end

  def update
    @user = User.find(params[:id])

    if @user.update(user_params)
      render :profile
    else
      render(
        json: { errors: @user.errors.full_messages },
        status: 422
      )
    end
  end

  def search
    @users = User.where(
      "LOWER(username) ~ ?",
      search_params[:query].downcase
    ).limit(10)
    render :search
  end

  private
  def user_params
    params.require(:user).permit(
      :username, :password,
      :birth_date, :workplace,
      :email, :phone_number,
      :hometown, :current_city,
      :high_school, :college, :college_major,
      :intro, :name_pronunciation,
      :profile_photo, :cover_photo
    )
  end

  def search_params
    params.require(:search).permit(:query)
  end
end
