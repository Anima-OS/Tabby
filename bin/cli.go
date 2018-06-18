package main

import (
	"bufio"
	"fmt"
	"os"
	"os/exec"
	// "strings"

	"github.com/fatih/color"

	"github.com/spf13/viper"

	"flag"
)

// Set up default colors
var green = color.New(color.FgGreen)
var yellow = color.New(color.FgYellow)
var bgBlue = color.New(color.BgBlue)
var bgGreen = color.New(color.BgGreen)

var cyanBright = color.New(color.FgHiCyan).SprintfFunc()

// Print help text
func displayHelp() {
	fmt.Print("\n")
	green.Printf("Usage:")
	fmt.Print("\n \n")
	fmt.Print("tabby PATH")
	fmt.Print("\n \n")
	fmt.Print("Options:")
	fmt.Print("\n")
	fmt.Println("-h, --help    display this help message")
	fmt.Println("-v, --version display runtime version")
	fmt.Println("")
	fmt.Println("PATH has to be one of:")
	bgBlue.Printf("URL")
	fmt.Printf(" || ")
	bgGreen.Printf("Path to package.json")
	fmt.Print("\n \n")
	fmt.Fprintf(color.Output, "More information can be found at %s \n", cyanBright("https://github.com/Anima-OS/Tabby"))
}

func displayVersion() {
	bgGreen.Print(viper.GetString("version"))
}

func main() {

	viper.SetConfigFile("../package.json")

	if err := viper.ReadInConfig(); err != nil {
		displayVersion()
	}

	// Set up command line flags
	help := flag.Bool("help", false, "display a help message")
	version := flag.Bool("version", false, "display runtime version")
	pkg := flag.String("pkg", "", "")

	flag.BoolVar(help, "h", false, "")
	flag.BoolVar(version, "v", false, "")

	// Overwrite flag.PrintDefaults()
	flag.Usage = func() {
		displayHelp()
	}

	// Parse input
	flag.Parse()

	// Process "--help"/"-h"
	if *help == true {
		displayHelp()
	}

	// Process "--version"/"-v"
	if *version == true {
		displayVersion()
	}

	if pkg != nil {
	}

	// If no arguments or flags are given, display help text
	if len(flag.Args()) == 0 && flag.NFlag() == 0 {
		cmd := exec.Command("C:\\Program Files\\Quokka\\Quokka.exe", "-app", "../application.ini", "-profile", "TabbyTest", "-new-instance", "-jsdebugger", "-aqq", "../examples/hello-world-html/main.js")

		cmdReader, err2 := cmd.StdoutPipe()
		if err2 != nil {
			fmt.Fprintln(os.Stderr, "Error creating StdoutPipe for Cmd", err2)
			os.Exit(1)
		}

		scanner := bufio.NewScanner(cmdReader)
		go func() {
			for scanner.Scan() {
				yellow.Printf("Render Process | %s\n", scanner.Text())
			}
		}()

		err := cmd.Run()
		if nil != err {
			panic(err)
		}
		displayHelp()
	}
}
