

# General shortcuts
alias ..="cd .."
alias ...="cd ../.."
alias c="clear"
alias reload="source ~/.zshrc"


# Git Shortcuts

alias gs="git status"
alias gad="git add ."
alias gcm="git commit -m"
alias gpush="git push"
alias gp="git pull"
alias gc="git checkout"
alias gcn="git checkout -b"
alias gb="git branch"
alias gd="git diff"
alias gcl="git clone"
alias gst="git stash"
alias gstpop="git stash pop"
alias gcp="git checkout -"
alias glg="git log --oneline --graph --decorate" # pretty log


# zshrc

alias zshrc="open ~/.zshrc"


# NPM & Yarn Shortcuts

alias getyarn="npm i -g yarn"
alias dev="yarn start"
alias yget="yarn add"
alias ndev="npm start"
alias nget="npm install"

# Dev Shortcuts
alias code.="code ."
alias ports="lsof -i -P -n | grep LISTEN"
alias ip="curl ifconfig.me"
alias killport="f() { lsof -ti:$1 | xargs kill -9 }; f" # usage: killport 3000

alias please="sudo !!"     # retry last cmd with sudo
alias ll="ls -la"          # common listing
alias cls="clear && printf '\e[3J'" # clear scrollback too

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion