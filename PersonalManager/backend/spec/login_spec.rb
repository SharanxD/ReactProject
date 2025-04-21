# spec/app_spec.rb
require 'rack/test'
require 'rspec'
require_relative '../myapi.rb'  # path to your main Ruby file

ENV['RACK_ENV'] = 'test'

RSpec.describe 'Personal Manager App' do
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end

  describe 'POST /signup' do
    it 'Signs up a new user with unique credentials' do
      post '/signup', { username: 'testuser', password: 'testpassword' }.to_json, { 'CONTENT_TYPE' => 'application/json' }
      expect(last_response.status).to eq(200)
      expect(last_response.body).to include('User created successfully')
    end
  end

  describe 'POST /login' do
    it 'logs in with correct credentials' do
      # Make sure the user exists (either seed the DB or run /signup first)
      post '/login', { username: 'testusernew', password: 'testpassword' }.to_json, { 'CONTENT_TYPE' => 'application/json' }
      expect(last_response.status).to eq(200)
      expect(last_response.body).to include('Login successful')
    end
  end
end
