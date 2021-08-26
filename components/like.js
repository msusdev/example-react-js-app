class LikeButton extends React.Component {
  state = {
    status: null,
    showLoginButton: true
  }
  async startLogin() {
    this.setState({
      status: "Running",
      showLoginButton: false
    });
  }
  render() {
    let { status, showLoginButton } = this.state;
    return (
      <section className={"d-grid gap-2"}>
        {status ?
          <div className="alert alert-success" role="alert">
            <h4 className="alert-heading">Status</h4>  
            <hr />
            <p>
              {status}
              <i className="fa fa-fw fa-cog fa-spin"></i>
            </p>            
          </div>
          : null
        }
        {showLoginButton ?
          <button type="button" className={"btn btn-success btn-lg"} onClick={() => this.startLogin()}>
            <i className="fa fa-fw fa-inverse fa-sign-in"></i>
            Login
          </button>
          : null
        }
      </section>
    )
  }
}