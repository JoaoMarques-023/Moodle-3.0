const express = require('express');
const router = express.Router();
const db = require('./db');

const UserController = require('./controllers/UserController');
const UserServices = require('./services/UserServices');

router.get('/users', UserController.AllUsers);
router.get('/user/:id_user', UserController.especificUser);


router.post('/login', UserController.login);
router.post('/userData', UserController.userData);

router.post('/inserirUser', UserController.inserirUser);
router.put('/updateUser/:id', UserController.updateUser);
router.delete('/deleteUser/:id', UserController.deleteUser);


router.get('/disciplinas', UserController.AllDisciplinas);



router.get('/disciplinas/:id/temas', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM Temas WHERE disciplina_id = ?', [id], (error, temas) => {
    if (error) {
      console.error('Erro ao buscar os temas da disciplina:', error);
      res.status(500).json({ error: 'Erro ao buscar os temas da disciplina' });
      return;
    }
    res.json({ result: temas });
  });
});



router.get('/temas/:id/conteudos', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM Conteudos WHERE tema_id = ?', [id], (error, conteudos) => {
    if (error) {
      console.error('Erro ao buscar os conteúdos do tema:', error);
      res.status(500).json({ error: 'Erro ao buscar os conteúdos do tema' });
      return;
    }
    res.json({ result: conteudos });
  });
});


router.put('/temas/:id', (req, res) => {
  const { id } = req.params;
  const { concluido } = req.body;

  db.query('UPDATE Temas SET concluido = ? WHERE idTemas = ?', [concluido, id], (error, results) => {
    if (error) {
      console.error('Erro ao atualizar o status de conclusão do tema:', error);
      res.status(500).json({ error: 'Erro ao atualizar o status de conclusão do tema' });
      return;
    }
    res.json({ success: true });
  });
});




router.get('/professor/:id/disciplinas', (req, res) => {
  const professorId = req.params.id;
  
  db.query('SELECT d.* FROM Disciplinas d JOIN Professores_Disciplinas pd ON d.idDisciplinas = pd.disciplina_id WHERE pd.professor_id = ?', [professorId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Ocorreu um erro ao obter as disciplinas associadas ao professor.' });
      return;
    }
    res.json({ result: results });
  });
});



router.get('/aluno/:id/disciplinas', (req, res) => {
  const alunoId = req.params.id;
  
  db.query('SELECT d.* FROM Disciplinas d JOIN Alunos_Disciplinas ad ON d.idDisciplinas = ad.disciplina_id WHERE ad.aluno_id = ?', [alunoId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Ocorreu um erro ao obter as disciplinas associadas ao aluno.' });
      return;
    }
    res.json({ result: results });
  });
});




/*
// Rota para listar todos os conteúdos de uma disciplina
router.get('/disciplinas/:id/conteudos', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM Conteudos WHERE tema_id = ?', [id], (error, results) => {
    if (error) {
      console.error('Erro ao buscar os conteúdos da disciplina:', error);
      res.status(500).json({ error: 'Erro ao buscar os conteúdos da disciplina' });
      return;
    }
    res.json({ result: results });
  });
});


router.get('/disciplinas/:id/temas', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM Temas WHERE disciplina_id = ?', [id], (error, temas) => {
    if (error) {
      console.error('Erro ao buscar os temas da disciplina:', error);
      res.status(500).json({ error: 'Erro ao buscar os temas da disciplina' });
      return;
    }
    res.json({ result: temas });
  });
});



*/
  
  




module.exports = router;