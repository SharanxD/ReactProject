require 'sinatra'
require 'sqlite3'
require 'bcrypt'
require 'json'
require 'rack/cors'
require 'jwt'

SECRET_KEY='SharanProject1'
DB = SQLite3::Database.new "db/database.sqlite3"
DB.results_as_hash = true

use Rack::Cors do
    allow do
      origins '*' # Allow all origins, you can specify specific domains here if needed
      resource '*', headers: :any, methods: [:get, :post, :options]
    end
  end

options "*" do
    response.headers["Allow"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = 'Authorization, Content-Type' # Included Authorizations for the headers
    200
end

before do
  content_type :json
  headers 'Access-Control-Allow-Origin' => '*' # CORS headers
end

post '/signup' do
  data = JSON.parse(request.body.read)
  username = data["username"]
  password = data["password"]
  password = BCrypt::Password.create(password)         #Bcrypt to encrypt the password
  begin
    DB.execute("INSERT INTO users (username, password) VALUES (?, ?)", [username, password])
    { message: "User created successfully" }.to_json
  rescue SQLite3::ConstraintException               # Results in any sql error which in this case is duplication.
    status 409
    { error: "Username already exists" }.to_json
  end
end

post '/login' do
  data = JSON.parse(request.body.read)
  username = data["username"]
  password = data["password"]
  user = DB.execute("SELECT * FROM users WHERE username = ?", [username]).first
  if user && BCrypt::Password.new(user["password"]) == password
    payload = { user_id: username, exp: Time.now.to_i + 3600 }
    token = JWT.encode(payload, SECRET_KEY, 'HS256')
    jwtquery=DB.execute("INSERT into jwt (tokenid,logtime) VALUES (?, datetime('now','localtime'))",[token])    # Creating JWT upon login
    if jwtquery
      { message: "Login successful" , token: token}.to_json
    else
      {message: "Error in JWT upload"}.to_json
    end
  else
    status 401
    { error: "Invalid credentials" }.to_json
  end
end

get '/' do
  { message: "Welcome to my API!" }.to_json
end


post '/tasklist' do

  auth_header = request.env['HTTP_AUTHORIZATION']

  if auth_header && auth_header.start_with?('Bearer ')
    token = auth_header.split(' ').last
    begin
      decoded_token = JWT.decode(token, SECRET_KEY, true, { algorithm: 'HS256' })         #Verifying the User
      username=decoded_token[0]["user_id"]
      results = DB.execute("SELECT * FROM tasks WHERE username= ?",[username])            # Getting all the tasks corelating to the username
      results.to_json
    rescue JWT::ExpiredSignature => e
      status 409
      {message: "JWT Expired Please login again."}.to_json
    
    rescue => e
      status 401
      {message: "JWT error"}.to_json
    end
  end
end

post '/tasks' do
  data = JSON.parse(request.body.read)
  username=data["username"]
  token=data["tokenid"]
  begin
    decoded_token = JWT.decode(token, SECRET_KEY, true, { algorithm: 'HS256' })          # Verifying the User
    
    jwtuser=decoded_token[0]["user_id"]
    if username==jwtuser
      title=data["title"]
      desc=data["desc"]
      endtime=data["endtime"]
      
      dbquery=DB.execute("INSERT INTO tasks(username,title,desc,createtime,endtime) values(?,?,?,datetime('now','localtime'),?)",[username,title,desc,endtime])
      if dbquery
        {message: "Task added successfully"}.to_json        # Adding a new task to the database
      else 
        {message: "Error in creating task"}.to_json
      end
      
    else
      status 409
      {message: "JWT User error"}.to_json
    end
  rescue JWT::ExpiredSignature => e
    status 409
    {message: "JWT Expired Please login again."}.to_json
  
  rescue => e
    status 401
    {message: e}.to_json
  end
end

post '/noteslist' do
  auth_header = request.env['HTTP_AUTHORIZATION']

  if auth_header && auth_header.start_with?('Bearer ')
    token = auth_header.split(' ').last
    begin
      decoded_token = JWT.decode(token, SECRET_KEY, true, { algorithm: 'HS256' })        # Verifying the User
      jwtuser=decoded_token[0]["user_id"]
      results = DB.execute("SELECT * FROM notes WHERE username= ?",[jwtuser])               # Getting all the notes co-relating to the User
      results.to_json 
    rescue JWT::ExpiredSignature => e
      status 409
      {message: "JWT Expired Please login again."}.to_json

    rescue => e
      status 401
      {message: "JWT error"}.to_json
    end
  end
end

post '/notes' do
  data = JSON.parse(request.body.read)
  username=data["username"]
  token=data["tokenid"]
  begin
    decoded_token = JWT.decode(token, SECRET_KEY, true, { algorithm: 'HS256' })     # Verifying the User
    jwtuser=decoded_token[0]["user_id"]
    if username==jwtuser
      notedata=data["notedata"]
      dbquery=DB.execute("INSERT INTO notes(username,notedata,createtime) values(?,?,datetime('now','localtime'))",[username,notedata])
      if dbquery
        {message: "Notes added successfully"}.to_json        # Adding a new Note to the server.
      else
        {message: "Error in adding notes"}.to_json
      end
      
    else
      status 409
      {message: "JWT User error"}.to_json
    end
  rescue JWT::ExpiredSignature => e
    status 409
    {message: "JWT Expired Please login again."}.to_json
  
  rescue => e
    status 401
    {message: e}.to_json
  end
end

# insert into notes(username,notedata,createtime) values("Sharan","Testing",datetime('now'));