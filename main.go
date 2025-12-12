go
package main

import (
	"flag"
	"fmt"
	"io"
	"log"
	"math/rand"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"strings"
	"sync"
	"time"
)

const (
	outputDir = "data"
	fullPath  = "data/full"
	litePath  = "data/lite"
)

// keyPattern is a pre-compiled regular expression to find keys in the format <code>key</code>.
var keyPattern = regexp.MustCompile(`<code>([A-Za-z0-9-]+)</code>`)

// fetchKeysFromURL fetches the content from the given URL and extracts keys.
func fetchKeysFromURL(urlStr string, client *http.Client) ([]string, error) {
	response, err := client.Get(urlStr)
	if err != nil {
		return nil, fmt.Errorf("failed to perform HTTP GET request for %s: %w", urlStr, err)
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to fetch %s: received status code %d", urlStr, response.StatusCode)
	}

	body, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body from %s: %w", urlStr, err)
	}

	matches := keyPattern.FindAllStringSubmatch(string(body), -1)

	var keys []string
	for _, match := range matches {
		keys = append(keys, match[1])
	}
	return keys, nil
}

// writeKeysToFile writes the list of keys to the specified file path.
func writeKeysToFile(keys []string, path string) error {
	// Use strings.Join for efficient concatenation with newlines,
	// then use os.WriteFile for atomic and efficient writing.
	content := []byte(strings.Join(keys, "\n"))
	// 0644 is a common permission for files (owner read/write, group/others read).
	return os.WriteFile(path, content, 0644)
}

// min is a helper function to determine the smaller of two integers.
func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func main() {
	proxy := flag.String("proxy", "", "HTTP or SOCKS5 proxy URL (e.g., http://proxy.example.com:8080 or socks5://localhost:1080)")
	flag.Parse()

	var client *http.Client
	defaultTimeout := 10 * time.Second // A reasonable default timeout for network requests

	if *proxy != "" {
		proxyURL, err := url.Parse(*proxy)
		if err != nil {
			log.Fatalf("Invalid proxy URL: %v", err)
		}
		transport := &http.Transport{
			Proxy: http.ProxyURL(proxyURL),
		}
		client = &http.Client{Transport: transport, Timeout: defaultTimeout}
	} else {
		client = &http.Client{Timeout: defaultTimeout}
	}

	sources := []string{
		"https://t.me/s/warpplus",
		"https://t.me/s/warppluscn",
		"https://t.me/s/warpPlusHome",
		"https://t.me/s/warp_veyke",
	}

	var (
		wg     sync.WaitGroup
		keysCh = make(chan []string, len(sources)) // Buffered channel to collect keys from concurrent fetches
	)

	for _, u := range sources {
		wg.Add(1)
		go func(urlStr string) {
			defer wg.Done()
			keys, err := fetchKeysFromURL(urlStr, client)
			if err != nil {
				log.Printf("Error fetching keys from %s: %v", urlStr, err)
				return
			}
			keysCh <- keys
		}(u)
	}

	// This goroutine waits for all fetch operations to complete and then closes the channel.
	go func() {
		wg.Wait()
		close(keysCh)
	}()

	var allKeys []string
	// Collect all keys as they arrive from the channel.
	for keys := range keysCh {
		allKeys = append(allKeys, keys...)
	}

	// Remove duplicates from the keys list using a map.
	uniqueKeysMap := make(map[string]struct{})
	for _, key := range allKeys {
		uniqueKeysMap[key] = struct{}{}
	}

	var keysList []string
	for key := range uniqueKeysMap {
		keysList = append(keysList, key)
	}

	if len(keysList) > 0 {
		// Create output directory if it does not exist.
		if err := os.MkdirAll(outputDir, os.ModePerm); err != nil {
			log.Fatalf("Error creating directory %s: %v", outputDir, err)
		}

		// Generate full file with up to 100 keys.
		// Use min for idiomatic and safe slicing.
		fullKeys := keysList[:min(len(keysList), 100)]
		if err := writeKeysToFile(fullKeys, fullPath); err != nil {
			log.Fatalf("Error writing to file %s: %v", fullPath, err)
		}

		// Generate lite file with up to 15 keys, shuffled.
		// Use a new rand.Rand instance for better seeding practices.
		r := rand.New(rand.NewSource(time.Now().UnixNano()))
		r.Shuffle(len(keysList), func(i, j int) {
			keysList[i], keysList[j] = keysList[j], keysList[i]
		})

		// Use min for idiomatic and safe slicing.
		liteKeys := keysList[:min(len(keysList), 15)]
		if err := writeKeysToFile(liteKeys, litePath); err != nil {
			log.Fatalf("Error writing to file %s: %v", litePath, err)
		}

		fmt.Println("successfully.")
	} else {
		fmt.Println("No keys found.")
	}
}