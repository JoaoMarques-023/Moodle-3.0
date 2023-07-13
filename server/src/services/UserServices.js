const db = require('../db');
const bcrypt = require('bcrypt');
module.exports = {

    AllUsers: () => {
        return new Promise((aceito, rejeitado) => {
          db.query('SELECT * FROM Utilizadores', (error, results) => {
            if (error) {
              rejeitado(error);
              return;
            }
            aceito(results); // Retorna todos os resultados encontrados
          });
        });
      },

    AllDisciplinas: () => {
        return new Promise((aceito, rejeitado) => {
          db.query('SELECT * FROM Disciplinas', (error, results) => {
            if (error) {
              rejeitado(error);
              return;
            }
            aceito(results); // Retorna todos os resultados encontrados
          });
        });
      },
      

    especificUser: (id_user) =>{
        return new Promise((aceito, rejeitado)=>{
            db.query('SELECT * FROM Utilizadores WHERE id=?', [id_user], (error,results)=>{
                if(error){ rejeitado(error); return;}
                if(results.length>0){
                  aceito(results[0]);
                }else{
                    aceito(false)
                }
               
            });
        });
    },
    
    

    getUserByEmail: (email) => {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Utilizadores WHERE email = ?', [email], (error, results) => {
          if (error) {
            reject(error);
            return;
          }
  
          if (results.length > 0) {
            resolve(results[0]);
          } else {
            resolve(null); // Usuário não encontrado
          }
        });
      });
    },
  
    verifyPassword: (password, hashedPassword) => {
      return password === hashedPassword;
    },
    
    

    getUserById: (id) => {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Utilizadores WHERE id = ?', [id], (error, results) => {
          if (error) {
            reject(error);
            return;
          }
    
          if (results.length > 0) {
            resolve(results[0]);
          } else {
            resolve(null); // Usuário não encontrado
          }
        });
      });
    },

    getAlunoIdByUtilizadorId: (utilizadorId) => {
      return new Promise((resolve, reject) => {
        db.query('SELECT id FROM Alunos WHERE utilizador_id = ?', [utilizadorId], (error, results) => {
          if (error) {
            reject(error);
            return;
          }
  
          if (results.length > 0) {
            resolve(results[0].id);
          } else {
            resolve(null); // Aluno não encontrado
          }
        });
      });
    },
  
    getProfessorIdByUtilizadorId: (utilizadorId) => {
      return new Promise((resolve, reject) => {
        db.query('SELECT id FROM Professores WHERE utilizador_id = ?', [utilizadorId], (error, results) => {
          if (error) {
            reject(error);
            return;
          }
  
          if (results.length > 0) {
            resolve(results[0].id);
          } else {
            resolve(null); // Professor não encontrado
          }
        });
      });
    },
  
   





    updateUser: (id, username, email, password, role) => {
      return new Promise((resolve, reject) => {
        db.query(
          'UPDATE Utilizadores SET username = ?, email = ?, password = ?, role = ? WHERE id = ?', 
          [username, email, password, role, id], 
          (error, results) => {
            if (error) {
              reject(error);
              return;
            }
    
            if (role === 'aluno') {
              db.query(
                'UPDATE Alunos SET utilizador_id = ? WHERE utilizador_id = ?', 
                [id, id], 
                (error, results) => {
                  if (error) {
                    reject(error);
                    return;
                  }
    
                  resolve(results);
                }
              );
            } else if (role === 'professor') {
              db.query(
                'UPDATE Professores SET utilizador_id = ? WHERE utilizador_id = ?', 
                [id, id], 
                (error, results) => {
                  if (error) {
                    reject(error);
                    return;
                  }
                  resolve(results);
                }
              );
            } else {
              resolve(results);
            }
          }
        );
      });
    },
    
    
    
    inserirUser: (username, email, password, role) => {
      return new Promise((resolve, reject) => {
        db.query(
          'INSERT INTO Utilizadores (username,  email, password, role) VALUES (?, ?, ?, ?)',
          [username, email, password, role],
          (error, results) => {
            if (error) {
              reject(error);
              return;
            }
    
            const userId = results.insertId;
    
            if (role === 'aluno') {
              db.query(
                'INSERT INTO Alunos (utilizador_id) VALUES (?)',
                [userId],
                (error, results) => {
                  if (error) {
                    reject(error);
                    return;
                  }
    
                  resolve(userId);
                }
              );
            } else if (role === 'professor') {
              db.query(
                'INSERT INTO Professores (utilizador_id) VALUES (?)',
                [userId],
                (error, results) => {
                  if (error) {
                    reject(error);
                    return;
                  }
    
                  resolve(userId);
                }
              );
            } else {
              resolve(userId);
            }
          }
        );
      });
    },
    
    
    
    
    
    deleteUser: (id) => {
      return new Promise((resolve, reject) => {
        db.query('DELETE FROM Alunos WHERE utilizador_id = ?', [id], (error, results) => {
          if (error) {
            reject(error);
            return;
          }
    
          db.query('DELETE FROM Professores WHERE utilizador_id = ?', [id], (error, results) => {
            if (error) {
              reject(error);
              return;
            }
    
            // Remover o ID do professor das disciplinas correspondentes
            db.query('UPDATE Disciplinas SET professor_id = NULL WHERE professor_id = ?', [id], (error, results) => {
              if (error) {
                reject(error);
                return;
              }
    
              db.query('DELETE FROM Utilizadores WHERE id = ?', [id], (error, results) => {
                if (error) {
                  reject(error);
                  return;
                }
    
                resolve(results);
              });
            });
          });
        });
      });
    },
    
      
};