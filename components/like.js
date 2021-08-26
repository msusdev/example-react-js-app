class LikeButton extends React.Component {
  state = {
    status: null,
    showLoginButton: true,
    account: null,
    token: null,
    graph: null
  }
  async startLogin() {
    this.setState({
      status: "Logging in",
      showLoginButton: false
    });    
    const config = {
      auth: {
        clientId: '<client-id>',
        authority: 'https://login.microsoftonline.com/organizations/',
        redirectUri: 'http://localhost:8080'
      }
    };
    var msalClient = new msal.PublicClientApplication(config);
    var loginRequest = {
      scopes: ['user.read']
    };
    let loginResponse = await msalClient.loginPopup(loginRequest);
    console.log('Login Response', loginResponse);
    this.setState({
      account: {
        name: loginResponse.account.name,
        email: loginResponse.account.username
      }
    });
    await this.getToken(msalClient, loginResponse.account);
  }
  async getToken(client, account) {
    this.setState({
      status: "Acquiring token",
    });
    var tokenRequest = {
      scopes: ['user.read'],
      account: account
    };
    let tokenResponse = await client.acquireTokenSilent(tokenRequest);
    console.log('Token Response', tokenResponse);
    this.setState({
      token: tokenResponse.accessToken
    });
    await this.queryGraph(tokenResponse.accessToken);
  }
  async queryGraph(token) {
    this.setState({
      status: "Querying graph",
    });
    let payload = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: {
          'Authorization': 'Bearer ' + token
      }
    });
    let json = await payload.json();
    console.log('Graph Response', json);
    this.setState({
      status: null,
      graph: {
        first: json.givenName,
        last: json.surname,
        email: json.userPrincipalName,
        location: json.officeLocation,
        phone: json.mobilePhone,
        title: json.jobTitle
      }
    });
  }
  render() {
    let { status, showLoginButton, account, token, graph } = this.state;
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
            <i className="fa fa-fw fa-inverse fa-sign-in mr-2"></i>Login
          </button>
          : null
        }        
        {graph ?
          <table className="table table-sm table-success table-striped">
            <thead>
              <tr>
                <th scope="col" colSpan="2">Query Graph (Profile) Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">First Name</th>
                <td>{graph.first}</td>
              </tr>
              <tr>
                <th scope="row">Last Name</th>
                <td>{graph.last}</td>
              </tr>
              <tr>
                <th scope="row">Job Title</th>
                <td>{graph.title}</td>
              </tr>
              <tr>
                <th scope="row">E-mail Address</th>
                <td>{graph.email}</td>
              </tr>
              <tr>
                <th scope="row">Phone Number</th>
                <td>{graph.phone}</td>
              </tr>
              <tr>
                <th scope="row">Office</th>
                <td>{graph.location}</td>
              </tr>
            </tbody>
          </table>
          : null
        }
        {token ?
          <table className="table table-sm">
            <thead>
              <tr>
                <th scope="col" colSpan="2">Get Token Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Access Token</th>
                <td>
                  <samp style={{width: "18rem", wordBreak: "break-all"}}>{token}</samp>
                </td>
              </tr>
            </tbody>
          </table>
          : null
        }
        {account ?
          <table className="table table-sm">
            <thead>
              <tr>
                <th scope="col" colSpan="2">Login Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Name</th>
                <td>{account.name}</td>
              </tr>
              <tr>
                <th scope="row">E-mail</th>
                <td>{account.email}</td>
              </tr>
            </tbody>
          </table>
          : null
        }
      </section>
    )
  }
}