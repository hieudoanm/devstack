// Package cmd ...
package cmd

import (
	"fmt"
	"maps-cli/utils"
	"time"

	"github.com/spf13/cobra"
)

// nowCmd represents the clock command
var nowCmd = &cobra.Command{
	Use:   "now",
	Short: "A brief description of your command",
	Long: `A longer description that spans multiple lines and likely contains examples
and usage of using your command. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	Run: func(cmd *cobra.Command, args []string) {
		utils.LogProgramName()
		t := time.Now()
		hours, minutes, seconds := t.Clock()
		date := t.Format("2006-01-02")
		zone, _ := t.Zone()
		var hoursString = utils.AddZero(hours)
		var minutesString = utils.AddZero(minutes)
		var secondsString = utils.AddZero(seconds)
		fmt.Printf("%s %s:%s:%s GMT%s\n", date, hoursString, minutesString, secondsString, zone)
	},
}

func init() {
	rootCmd.AddCommand(nowCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// nowCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// nowCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
