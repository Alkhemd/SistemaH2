// Controlador base para operaciones CRUD comunes
class BaseController {
  constructor(model, modelName = '') {
    this.model = model;
    this.modelName = modelName;
  }

  // GET /api/entidad - Obtener todos los registros
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;
      const offset = (page - 1) * limit;
      
      const options = {
        limit: parseInt(limit),
        offset: parseInt(offset),
        where: {}
      };

      // Aplicar filtros básicos
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== '') {
          options.where[key] = filters[key];
        }
      });

      const { count, rows } = await this.model.findAndCountAll(options);
      
      res.json({
        success: true,
        data: rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      });
    } catch (error) {
      console.error(`Error en getAll ${this.modelName}:`, error);
      res.status(500).json({
        success: false,
        message: `Error al obtener ${this.modelName}`,
        error: error.message
      });
    }
  }

  // GET /api/entidad/:id - Obtener un registro por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const record = await this.model.findByPk(id);
      
      if (!record) {
        return res.status(404).json({
          success: false,
          message: `${this.modelName} no encontrado`
        });
      }

      res.json({
        success: true,
        data: record
      });
    } catch (error) {
      console.error(`Error en getById ${this.modelName}:`, error);
      res.status(500).json({
        success: false,
        message: `Error al obtener ${this.modelName}`,
        error: error.message
      });
    }
  }

  // POST /api/entidad - Crear un nuevo registro
  async create(req, res) {
    try {
      // Crear una copia del body sin campos de ID (seguridad)
      const data = { ...req.body };
      
      // Eliminar cualquier campo que termine en '_id' y sea la clave primaria
      const primaryKey = this.model.primaryKeyAttribute;
      if (data[primaryKey] !== undefined) {
        delete data[primaryKey];
      }
      
      // Prevenir que el usuario envíe IDs explícitos (solo autoincrementales)
      const idFields = Object.keys(data).filter(key => 
        key === primaryKey || 
        (key.endsWith('_id') && this.model.rawAttributes[key]?.primaryKey)
      );
      
      idFields.forEach(field => delete data[field]);
      
      const record = await this.model.create(data);
      
      res.status(201).json({
        success: true,
        message: `${this.modelName} creado exitosamente`,
        data: record
      });
    } catch (error) {
      console.error(`Error en create ${this.modelName}:`, error);
      
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Error de validación',
          errors: error.errors.map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          success: false,
          message: 'Error: registro duplicado',
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: `Error al crear ${this.modelName}`,
        error: error.message
      });
    }
  }

  // PUT /api/entidad/:id - Actualizar un registro
  async update(req, res) {
    try {
      const { id } = req.params;
      const record = await this.model.findByPk(id);
      
      if (!record) {
        return res.status(404).json({
          success: false,
          message: `${this.modelName} no encontrado`
        });
      }

      // Crear una copia del body sin campos de ID (seguridad)
      const data = { ...req.body };
      
      // Eliminar la clave primaria del body para prevenir modificación
      const primaryKey = this.model.primaryKeyAttribute;
      if (data[primaryKey] !== undefined) {
        delete data[primaryKey];
      }
      
      // Prevenir modificación de IDs
      const idFields = Object.keys(data).filter(key => 
        key === primaryKey || 
        (key.endsWith('_id') && this.model.rawAttributes[key]?.primaryKey)
      );
      
      idFields.forEach(field => delete data[field]);

      await record.update(data);
      
      res.json({
        success: true,
        message: `${this.modelName} actualizado exitosamente`,
        data: record
      });
    } catch (error) {
      console.error(`Error en update ${this.modelName}:`, error);
      
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Error de validación',
          errors: error.errors.map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }

      res.status(500).json({
        success: false,
        message: `Error al actualizar ${this.modelName}`,
        error: error.message
      });
    }
  }

  // DELETE /api/entidad/:id - Eliminar un registro
  async delete(req, res) {
    try {
      const { id } = req.params;
      const record = await this.model.findByPk(id);
      
      if (!record) {
        return res.status(404).json({
          success: false,
          message: `${this.modelName} no encontrado`
        });
      }

      await record.destroy();
      
      res.json({
        success: true,
        message: `${this.modelName} eliminado exitosamente`
      });
    } catch (error) {
      console.error(`Error en delete ${this.modelName}:`, error);
      
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(409).json({
          success: false,
          message: `No se puede eliminar ${this.modelName}: tiene registros relacionados`,
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: `Error al eliminar ${this.modelName}`,
        error: error.message
      });
    }
  }
}

module.exports = BaseController;