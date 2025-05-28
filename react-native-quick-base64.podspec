require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-quick-base64"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => min_ios_version_supported }
  s.source       = { :git => "https://github.com/craftzdog/react-native-quick-base64.git", :tag => "#{s.version}" }

  s.source_files =
  s.source_files = [
    "ios/**/*.{h,m,mm}",
    "cpp/**/*.{h,cpp}"
  ]

  s.header_mappings_dir = 'ios'
  s.pod_target_xcconfig = {
    "USE_HEADERMAP" => "NO"
  }

  if respond_to?(:install_modules_dependencies)
    install_modules_dependencies(s)
  else
    s.dependency "React-Core"
  end
end
