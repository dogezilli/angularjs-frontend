export default class FormController {
  constructor($state, $stateParams, usuarioService, processoService) {
    this.record = {};
    this.usuario = {};
    this.usuarios = [];
    this.usuariosAdicionados = [];
    this._$state = $state;
    this._id = $stateParams.id;
    this._usuarioService = usuarioService;
    this._processoService = processoService;
    if (this._id) {
      this.findById();
    }
    this.findUsuarios();
    this.cols = [
      {
        label: "Login",
        value: "login",
        type: "text"
      }
    ];
  }

  async save() {
    this.record.pareceres = [];
    this.usuariosAdicionados.forEach(usuario => {
      let parecer = {};
      parecer.usuario = {};
      parecer.usuario.id = usuario.id;
      parecer.descricao = null;
      parecer.pendente = true;
      this.record.pareceres.push(parecer);
    });
    if (this._id) {
      await this._processoService.update(this.record);
    } else {
      await this._processoService.insert(this.record);
    }
    this._$state.go("app.processo.list");
  }

  findById() {
    return this._processoService.findById(this._id).then(response => {
      this.record = response;
      this.record.pareceres.forEach(parecer => {
        this._usuarioService.findById(parecer.usuario.id).then(response => {
          this.usuariosAdicionados.push(response);
        });
      });
      return this.record;
    });
  }

  findUsuarios() {
    return this._usuarioService.findAll().then(response => {
      this.usuarios = response.records;
      return this.usuarios;
    });
  }

  incluirUsuario() {
    this.usuariosAdicionados.push(this.usuario);
  }

  removerUsuario(usuario) {
    this.usuariosAdicionados.pop(usuario);
  }
}

FormController.$inject = [
  "$state",
  "$stateParams",
  "usuarioService",
  "processoService"
];
