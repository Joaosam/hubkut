window.onload = function verifyThemeOnLoad() {
  const theme = localStorage.getItem('Theme')
  if (theme == null) {
    localStorage.setItem('Theme', 'light')
  } else if (theme == 'dark') {
    document.body.classList.add('darkTheme')
  }
}

function changeTheme() {
  const theme = document.body.classList.toggle('darkTheme')
  if (theme == true) {
    localStorage.setItem('Theme', 'dark')
  } else {
    localStorage.setItem('Theme', 'light')
  }
}

function login() {
  const user = document.getElementById('userGithub').value
  console.log('User:', user)

  if (!user) {
    swal({
      title: 'Erro ao consultar',
      text: 'Digite um usuário',
      icon: 'error',
      button: 'Fechar'
    })
  } else {
    window.location.href = `./home/home.html?findUserHubkut=${user}`
  }
}

// Nessa função permito a repetição de números, isso implica na repetição de pessoas que o usuário segue
function setRandomUsersFollowing(maxNumbers, data) {
  for (cont = 0; cont <= 5; cont++) {
    const random = Math.floor(Math.random() * maxNumbers)
    document.getElementById(`following${cont}`).src = data[random].avatar_url
  }
}

function setRandomUsersFollower(maxNumbers, data) {
  for (cont = 0; cont <= 5; cont++) {
    const random = Math.floor(Math.random() * maxNumbers)
    document.getElementById(`follower${cont}`).src = data[random].avatar_url
  }
}

function setRandomNumbersFollowing(maxNumbers, data) {
  let list = []
  let randomNumber
  let tmp

  for (let i = 0; i < maxNumbers; i++) {
    list[i] = i + 1
  }

  for (let i = list.length; i; ) {
    // Gero números aleatórios
    randomNumber = (Math.random() * i--) | 0
    tmp = list[randomNumber]
    // troca o número aleatório pelo atual
    list[randomNumber] = list[i]
    // troca o atual pelo aleatório
    list[i] = tmp - 1
  }

  for (cont = 0; cont <= 5; cont++) {
    document.getElementById(`following${cont}`).src =
      data[list[cont]].avatar_url
  }
}

function setRandomNumbersFollower(maxNumbers, data) {
  let list = []
  let randomNumber
  let tmp

  for (let i = 0; i < maxNumbers; i++) {
    list[i] = i + 1
  }

  for (let i = list.length; i; ) {
    // Gero números aleatórios
    randomNumber = (Math.random() * i--) | 0
    tmp = list[randomNumber]
    // troca o número aleatório pelo atual
    list[randomNumber] = list[i]
    // troca o atual pelo aleatório
    list[i] = tmp - 1
  }

  for (cont = 0; cont <= 5; cont++) {
    document.getElementById(`follower${cont}`).src = data[list[cont]].avatar_url
  }
}

function getUrlGitHub() {
  const url = window.location.href
  const res = url.split('=')
  const userGithub = res[1]

  const urlApi = `https://api.github.com/users/${userGithub}`

  async function makeRequest() {
    try {
      const response = await fetch(urlApi)

      if (response.status == 200) {
        const data = await response.json()
        imgProfileGit.src = data.avatar_url
        nameBio.textContent = data.name
        infoBio.textContent = data.bio
        loginProfile.textContent = data.login
        numberFollowing.textContent = data.following
        numberFollowers.textContent = data.followers
        followers.textContent = data.followers
        following.textContent = data.following
        repositories.textContent = data.public_repos
        building.textContent = data.company
        map.textContent = data.location
        email.textContent = data.email
        portfolio.textContent = data.blog

        inicio.href = `./home.html?findUserHubkut=${userGithub}`
        viewAllFollowing.href = `https://github.com/${userGithub}?tab=following`
        viewAllFollowers.href = `https://github.com/${userGithub}?tab=followers`
        portfolio.href = data.blog

        // Seguindo
        const nFollowing = data.following
        let pageFollowing = 1

        // Valido se o usuário está seguindo mais de 30 pessoas
        if (nFollowing > 30) {
          // Gero números aleatórios em cima da quantidade de páginas disponíveis da API
          pageFollowing = Math.floor((Math.random() * nFollowing) / 30)
        }

        console.log('Page Following:', pageFollowing)

        const apiFollowing = `https://api.github.com/users/${userGithub}/following?page=${pageFollowing}`
        fetch(apiFollowing)
          .then(responseAPI => responseAPI.json())
          .then(data => {
            const maxNumbers = data.length

            // Valido se o número máximo de pessoas que o usuário segue é menor que 6
            if (maxNumbers < 6) {
              // Nesse for permito a repetição de números, isso implica na repetição de pessoas que o usuário segue
              setRandomUsersFollowing(maxNumbers, data)
              // Gero uma lista, aqui a ideia é gerar números aleatórios não repetidos
            } else {
              setRandomNumbersFollowing(maxNumbers, data)
            }
          })

        // Seguidores
        const nFollower = data.followers
        let pageFollower = 1

        // Valido se o usuário tem mais de 30 seguidores
        if (nFollower > 30) {
          // Gero números aleatórios em cima da quantidade de páginas disponíveis da API
          pageFollower = Math.floor((Math.random() * nFollower) / 30)
        }

        console.log('Page Follower:', pageFollower)

        const apiFollower = `https://api.github.com/users/${userGithub}/followers?page=${pageFollower}`
        fetch(apiFollower)
          .then(responseAPI => responseAPI.json())
          .then(data => {
            const maxNumbers = data.length

            // Valido se o número máximo de seguidores  é menor que 6
            if (maxNumbers < 6) {
              // Nesse for permito a repetição de números, isso implica na repetição de seguidores
              setRandomUsersFollower(maxNumbers, data)
              // Gero uma lista, aqui a ideia é gerar números aleatórios não repetidos
            } else {
              setRandomNumbersFollower(maxNumbers, data)
            }
          })
      } else if (response.status == 404) {
        window.open('../notFound/notFound.html', '_self')
      } else {
        throw new Error('Falha ao buscar usuário')
      }
    } catch (error) {
      swal({
        title: 'Erro ao consultar',
        text: error.message,
        icon: 'error',
        button: 'Fechar'
      })
      console.log('Error:', error.message)
    }
  }

  if (userGithub) {
    makeRequest()
  }
}
getUrlGitHub()