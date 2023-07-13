const UserService = require('../services/UserServices');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "your-secret-key"; // Chave secreta para assinar o token JWT

module.exports = {

  AllUsers: async (req, res) => {
    try {
      const users = await UserService.AllUsers();
      res.json({ result: users });
    } catch (error) {
      console.error('Error retrieving users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  AllDisciplinas: async (req, res) => {
    try {
      const disciplinas = await UserService.AllDisciplinas();
      res.json({ result: disciplinas });
    } catch (error) {
      console.error('Error retrieving diciplinas:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  especificUser: async (req, res) => {
    try {
      const id_user = req.params.id;
      const user = await UserService.especificUser(id_user);
      
      if (user) {
        res.json({ result: user });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error retrieving user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /*
  inserirUser: async (req, res) => {
    try {
      const { username, password, email, role } = req.body;

      // Aqui você pode adicionar a lógica para validar os dados do usuário antes de inseri-lo no banco de dados

      // Hash da senha antes de armazená-la no banco de dados
      const hashedPassword = await bcrypt.hash(password, 10);

      // Inserir o usuário no banco de dados
      const newUser = await UserService.inserirUser(username, hashedPassword, email, role);
      res.json({ result: newUser });
    } catch (error) {
      console.error('Error inserting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
*/
  inserirUser: async(req, res) => {
    let json = {error:'', result:{}};

    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let role = req.body.role;

    if (username && role){
        let UserCodigo = await UserService.inserirUser(username,email, password, role);
        json.result = {
            id: UserCodigo,
            username,
            email,
            password,
            role
        };
    }else{
        json.error = 'Campos não enviados';
    }
    res.json(json);
},




  login: async (req, res) => {
    const { email, password } = req.body;
  
    console.log('Email:', email);
    console.log('Password:', password);
  
    // Verifique se o email e a senha foram fornecidos
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
  
    try {
      // Verifique se o usuário existe no banco de dados
      const user = await UserService.getUserByEmail(email);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Verifique se a senha está correta
      const isPasswordValid = await UserService.verifyPassword(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
      }
  
      // Gere um token JWT para o usuário
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: '11111111', // Token expira em 30 segundos
      });
  
      // Retorne o token JWT para o cliente
      return res.json({ token });
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  userData: async (req, res) => {
    try {
      const { token } = req.body;
  
      // Verificar se o token foi fornecido
      if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
      }
  
      // Verificar e decodificar o token JWT
      const decodedToken = jwt.verify(token, JWT_SECRET);
      const userId = decodedToken.userId;
  
      // Obter o ID da tabela "Aluno" com base no ID da tabela "Utilizador"
      const alunoId = await UserService.getAlunoIdByUtilizadorId(userId);
      // Obter o ID da tabela "Professor" com base no ID da tabela "Utilizador"
      const professorId = await UserService.getProfessorIdByUtilizadorId(userId);
  
      // Obter os dados do usuário com base no ID
      const user = await UserService.getUserById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Criar objeto com as informações a serem enviadas como resposta
      const responseData = {
        userData: { alunoId, professorId },
        userDataA: user
      };
  
      // Retornar os dados do usuário
      res.json(responseData);
  
      console.log('id do user:', userId);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
  
      console.error('Error retrieving user data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  


  /*  userData: async (req, res) => {
    try {
      const { token } = req.body;

      // Verificar se o token foi fornecido
      if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
      }

      // Verificar e decodificar o token JWT
      const decodedToken = jwt.verify(token, JWT_SECRET);
      const userId = decodedToken.userId;
      

      // Obter os dados do usuário com base no ID
      const user = await UserService.getUserById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Retornar os dados do usuário
      res.json({ userData: user });

      console.log('id do user:', userId);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }

      console.error('Error retrieving user data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },*/



  updateUser: async (req, res) => {
      let json = {error:'', result:{}};

      let id = req.params.id;
      let username = req.body.username;
      let email = req.body.email;
      let password = req.body.password;
      let role = req.body.role;

      if(id && username && email && password && role){
         await UserService.updateUser(id, username, email, password, role);

         json.result = {
          id,
          username,
          email,
          password,
          role
         };
      }else{
        json.error = 'Internal server error';
      }
      res.json(json); 
      },




      deleteUser: async(req, res) => {
        let json = {error:'', result:{}};

        await UserService.deleteUser(req.params.id);
    
        res.json(json);
    },











  };



