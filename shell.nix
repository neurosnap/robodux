let pkgs = import <nixpkgs> {};

in pkgs.mkShell rec {
  name = "saga-query";

  buildInputs = with pkgs; [
    nodejs-14_x yarn
  ];
}
