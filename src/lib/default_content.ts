export default {
	type: 'doc',
	content: [
		{
			type: 'heading',
			attrs: {
				textAlign: 'center',
				level: 1
			},
			content: [
				{
					type: 'text',
					text: 'Welcome to Edra'
				}
			]
		},
		{
			type: 'paragraph',
			attrs: {
				textAlign: 'justify'
			},
			content: [
				{
					type: 'text',
					text: 'Edra is the best '
				},
				{
					type: 'text',
					marks: [
						{
							type: 'textStyle',
							attrs: {
								color: '#800080',
								fontSize: null
							}
						},
						{
							type: 'bold'
						}
					],
					text: 'rich'
				},
				{
					type: 'text',
					text: ' text based editor made for '
				},
				{
					type: 'text',
					marks: [
						{
							type: 'link',
							attrs: {
								href: 'https://svelte.dev',
								target: '_blank',
								rel: 'noopener noreferrer nofollow',
								class: null
							}
						}
					],
					text: 'svelte 5'
				},
				{
					type: 'text',
					text: ' with '
				},
				{
					type: 'text',
					marks: [
						{
							type: 'link',
							attrs: {
								href: 'http://tiptap.dev',
								target: '_blank',
								rel: 'noopener noreferrer nofollow',
								class: null
							}
						}
					],
					text: 'tiptap V3'
				},
				{
					type: 'text',
					text: '. This '
				},
				{
					type: 'text',
					marks: [
						{
							type: 'textStyle',
							attrs: {
								color: null,
								fontSize: ''
							}
						}
					],
					text: 'editor'
				},
				{
					type: 'text',
					text: ' is battery '
				},
				{
					type: 'text',
					marks: [
						{
							type: 'textStyle',
							attrs: {
								color: null,
								fontSize: ''
							}
						}
					],
					text: 'included'
				},
				{
					type: 'text',
					text: '. It '
				},
				{
					type: 'text',
					marks: [
						{
							type: 'textStyle',
							attrs: {
								color: null,
								fontSize: '1.25rem'
							}
						}
					],
					text: 'supports'
				},
				{
					type: 'text',
					marks: [
						{
							type: 'bold'
						}
					],
					text: ' bold'
				},
				{
					type: 'text',
					text: ','
				},
				{
					type: 'text',
					marks: [
						{
							type: 'italic'
						}
					],
					text: ' italic'
				},
				{
					type: 'text',
					text: ', '
				},
				{
					type: 'text',
					marks: [
						{
							type: 'underline'
						}
					],
					text: 'underline'
				},
				{
					type: 'text',
					text: ', '
				},
				{
					type: 'text',
					marks: [
						{
							type: 'strike'
						}
					],
					text: 'strikc through'
				},
				{
					type: 'text',
					text: ', '
				},
				{
					type: 'text',
					marks: [
						{
							type: 'code'
						}
					],
					text: 'inline code'
				},
				{
					type: 'text',
					text: ', Superscript A'
				},
				{
					type: 'text',
					marks: [
						{
							type: 'superscript'
						}
					],
					text: 'b'
				},
				{
					type: 'text',
					text: ' and subscript A'
				},
				{
					type: 'text',
					marks: [
						{
							type: 'subscript'
						}
					],
					text: 'b'
				},
				{
					type: 'text',
					text: '. We support text colors like '
				},
				{
					type: 'text',
					marks: [
						{
							type: 'textStyle',
							attrs: {
								color: '#A52A2A',
								fontSize: null
							}
						}
					],
					text: 'red'
				},
				{
					type: 'text',
					text: ', '
				},
				{
					type: 'text',
					marks: [
						{
							type: 'textStyle',
							attrs: {
								color: '#0000FF',
								fontSize: null
							}
						}
					],
					text: 'blue'
				},
				{
					type: 'text',
					text: ' and '
				},
				{
					type: 'text',
					marks: [
						{
							type: 'highlight',
							attrs: {
								color: '#008000'
							}
						}
					],
					text: 'hightlights'
				},
				{
					type: 'text',
					text: '. '
				}
			]
		},
		{
			type: 'blockquote',
			content: [
				{
					type: 'paragraph',
					attrs: {
						textAlign: 'justify'
					},
					content: [
						{
							type: 'text',
							text: 'We also have quote blocks. These can really '
						},
						{
							type: 'text',
							marks: [
								{
									type: 'textStyle',
									attrs: {
										color: null,
										fontSize: ''
									}
								}
							],
							text: 'differentiate'
						},
						{
							type: 'text',
							text: ' your content while looking sleek and unbothered.'
						}
					]
				}
			]
		},
		{
			type: 'paragraph',
			attrs: {
				textAlign: 'justify'
			},
			content: [
				{
					type: 'text',
					text: 'We also have 4 levels of headings to give '
				},
				{
					type: 'text',
					marks: [
						{
							type: 'textStyle',
							attrs: {
								color: null,
								fontSize: ''
							}
						}
					],
					text: 'you'
				},
				{
					type: 'text',
					text: ' a '
				},
				{
					type: 'text',
					marks: [
						{
							type: 'textStyle',
							attrs: {
								color: null,
								fontSize: ''
							}
						}
					],
					text: 'better'
				},
				{
					type: 'text',
					text: ' '
				},
				{
					type: 'text',
					marks: [
						{
							type: 'textStyle',
							attrs: {
								color: null,
								fontSize: ''
							}
						}
					],
					text: 'experience'
				},
				{
					type: 'text',
					text: ' on topics you are commiting to. Moreover, we have 3 types of lists.'
				}
			]
		},
		{
			type: 'orderedList',
			attrs: {
				start: 1,
				type: null
			},
			content: [
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							attrs: {
								textAlign: null
							},
							content: [
								{
									type: 'text',
									text: 'Numbered or ordered list'
								}
							]
						}
					]
				}
			]
		},
		{
			type: 'bulletList',
			content: [
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							attrs: {
								textAlign: null
							},
							content: [
								{
									type: 'text',
									text: 'Unordered List'
								}
							]
						}
					]
				}
			]
		},
		{
			type: 'taskList',
			content: [
				{
					type: 'taskItem',
					attrs: {
						checked: false
					},
					content: [
						{
							type: 'paragraph',
							attrs: {
								textAlign: null
							},
							content: [
								{
									type: 'text',
									text: 'Checklist for getting thing done. Do toggle this checklist.'
								}
							]
						}
					]
				}
			]
		},
		{
			type: 'horizontalRule'
		},
		{
			type: 'heading',
			attrs: {
				textAlign: null,
				level: 2
			},
			content: [
				{
					type: 'text',
					text: 'Code Block and Highlights'
				}
			]
		},
		{
			type: 'codeBlock',
			attrs: {
				language: 'go'
			},
			content: [
				{
					type: 'text',
					text: 'func twoSum(nums []int, target int) []int { \n\tvar res []int\n\tmp := make(map[int]int)\n\tfor idx, val := range nums {\n\t\ttoBeSearched := target - val\n\t\tif _, ok := mp[toBeSearched]; ok {\n\t\t\tres = append(res, mp[toBeSearched], idx)\n\t\t\tbreak\n\t\t}\n\t\tmp[val] = idx\n\t}\n\treturn res\n}'
				}
			]
		},
		{
			type: 'horizontalRule'
		},
		{
			type: 'heading',
			attrs: {
				textAlign: null,
				level: 2
			},
			content: [
				{
					type: 'text',
					text: 'Media and Placeholders'
				}
			]
		},
		{
			type: 'image-placeholder'
		},
		{
			type: 'image',
			attrs: {
				src: 'https://placehold.co/800x400/6A00F5/white',
				alt: null,
				title: null,
				width: '80.1010101010101%',
				height: null,
				align: 'center'
			}
		},
		{
			type: 'video-placeholder'
		},
		{
			type: 'video',
			attrs: {
				src: 'https://videos.pexels.com/video-files/2491284/2491284-uhd_2732_1440_24fps.mp4',
				alt: null,
				title: null,
				width: '75.15151515151514%',
				height: null,
				align: 'center'
			}
		},
		{
			type: 'audio-placeholder'
		},
		{
			type: 'audio',
			attrs: {
				src: 'https://cdn.pixabay.com/audio/2024/10/30/audio_42e6870f29.mp3',
				alt: null,
				title: null,
				width: '57.47474747474747%',
				height: null,
				align: 'center'
			}
		},
		{
			type: 'iframe-placeholder'
		},
		{
			type: 'iframe',
			attrs: {
				src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3748.5645078258503!2d75.17451197505285!3d20.026784381383496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdb93bd138ae4bd%3A0x574c6482cf0b89cf!2sEllora%20Caves!5e0!3m2!1sen!2sin!4v1742466514831!5m2!1sen!2sin',
				alt: null,
				title: null,
				width: '67.87878787878788%',
				height: null,
				align: 'center'
			}
		},
		{
			type: 'horizontalRule'
		},
		{
			type: 'heading',
			attrs: {
				textAlign: null,
				level: 2
			},
			content: [
				{
					type: 'text',
					text: 'Typography'
				}
			]
		},
		{
			type: 'paragraph',
			attrs: {
				textAlign: null
			},
			content: [
				{
					type: 'text',
					text: 'Typography support e.g. type '
				},
				{
					type: 'text',
					marks: [
						{
							type: 'code'
						}
					],
					text: '!='
				},
				{
					type: 'text',
					text: ' and it becomes ≠. Similarly (c) becomes ©, -> becomes → and many more like 1×2, ½. We also have color visualizer. #FFF, #000, #FF00FF can be visualized. '
				}
			]
		},
		{
			type: 'horizontalRule'
		},
		{
			type: 'heading',
			attrs: {
				textAlign: null,
				level: 2
			},
			content: [
				{
					type: 'text',
					text: 'Tables'
				}
			]
		},
		{
			type: 'table',
			content: [
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableCell',
							attrs: {
								colspan: 1,
								rowspan: 1,
								colwidth: [267],
								style: null
							},
							content: [
								{
									type: 'paragraph',
									attrs: {
										textAlign: null
									},
									content: [
										{
											type: 'text',
											text: 'Hello World'
										}
									]
								}
							]
						},
						{
							type: 'tableCell',
							attrs: {
								colspan: 1,
								rowspan: 1,
								colwidth: [322],
								style: null
							},
							content: [
								{
									type: 'paragraph',
									attrs: {
										textAlign: null
									},
									content: [
										{
											type: 'text',
											text: 'Hello World'
										}
									]
								}
							]
						},
						{
							type: 'tableCell',
							attrs: {
								colspan: 1,
								rowspan: 1,
								colwidth: [195],
								style: null
							},
							content: [
								{
									type: 'paragraph',
									attrs: {
										textAlign: null
									}
								}
							]
						}
					]
				},
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableCell',
							attrs: {
								colspan: 1,
								rowspan: 1,
								colwidth: [267],
								style: null
							},
							content: [
								{
									type: 'paragraph',
									attrs: {
										textAlign: null
									}
								}
							]
						},
						{
							type: 'tableCell',
							attrs: {
								colspan: 1,
								rowspan: 1,
								colwidth: [322],
								style: null
							},
							content: [
								{
									type: 'paragraph',
									attrs: {
										textAlign: null
									}
								}
							]
						},
						{
							type: 'tableCell',
							attrs: {
								colspan: 1,
								rowspan: 1,
								colwidth: [195],
								style: null
							},
							content: [
								{
									type: 'paragraph',
									attrs: {
										textAlign: null
									}
								}
							]
						}
					]
				},
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableCell',
							attrs: {
								colspan: 1,
								rowspan: 1,
								colwidth: [267],
								style: null
							},
							content: [
								{
									type: 'paragraph',
									attrs: {
										textAlign: null
									}
								}
							]
						},
						{
							type: 'tableCell',
							attrs: {
								colspan: 1,
								rowspan: 1,
								colwidth: [322],
								style: null
							},
							content: [
								{
									type: 'paragraph',
									attrs: {
										textAlign: null
									}
								}
							]
						},
						{
							type: 'tableCell',
							attrs: {
								colspan: 1,
								rowspan: 1,
								colwidth: [195],
								style: null
							},
							content: [
								{
									type: 'paragraph',
									attrs: {
										textAlign: null
									}
								}
							]
						}
					]
				}
			]
		},
		{
			type: 'heading',
			attrs: {
				textAlign: null,
				level: 3
			},
			content: [
				{
					type: 'text',
					marks: [
						{
							type: 'textStyle',
							attrs: {
								color: 'var(--tw-prose-headings)',
								fontSize: '1.5em'
							}
						}
					],
					text: 'Rending Math and '
				},
				{
					type: 'inlineMath',
					attrs: {
						latex: '\\LaTeX',
						evaluate: 'no',
						display: 'no'
					}
				},
				{
					type: 'text',
					text: '.  '
				}
			]
		},
		{
			type: 'paragraph',
			attrs: {
				textAlign: null
			},
			content: [
				{
					type: 'text',
					text: 'The editor supports the '
				},
				{
					type: 'inlineMath',
					attrs: {
						latex: '\\LaTeX',
						evaluate: 'no',
						display: 'no'
					}
				},
				{
					type: 'text',
					text: ' rendering. e.g.'
				}
			]
		},
		{
			type: 'orderedList',
			attrs: {
				start: 1,
				type: null
			},
			content: [
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							attrs: {
								textAlign: null
							},
							content: [
								{
									type: 'text',
									marks: [
										{
											type: 'textStyle',
											attrs: {
												color: '#A52A2A',
												fontSize: null
											}
										}
									],
									text: 'Functions like'
								},
								{
									type: 'text',
									text: ', '
								},
								{
									type: 'inlineMath',
									attrs: {
										latex: 'sin²\\theta + cos²\\theta=1, a²+b²=c²',
										evaluate: 'no',
										display: 'no'
									}
								}
							]
						}
					]
				},
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							attrs: {
								textAlign: null
							},
							content: [
								{
									type: 'text',
									marks: [
										{
											type: 'highlight',
											attrs: {
												color: '#A52A2A'
											}
										}
									],
									text: 'Matrix like unit matrix'
								}
							]
						},
						{
							type: 'paragraph',
							attrs: {
								textAlign: null
							},
							content: [
								{
									type: 'inlineMath',
									attrs: {
										latex: '\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}',
										evaluate: 'no',
										display: 'no'
									}
								}
							]
						},
						{
							type: 'paragraph',
							attrs: {
								textAlign: null
							},
							content: [
								{
									type: 'text',
									text: 'or more matrices like'
								}
							]
						},
						{
							type: 'paragraph',
							attrs: {
								textAlign: null
							},
							content: [
								{
									type: 'inlineMath',
									attrs: {
										latex:
											'\\begin{pmatrix} 1 & 0 & \\cdots & 0 \\\\ 0 & 1 & \\cdots & 0 \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ 0 & 0 & \\cdots & 1 \\end{pmatrix}',
										evaluate: 'no',
										display: 'no'
									}
								}
							]
						}
					]
				},
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							attrs: {
								textAlign: null
							},
							content: [
								{
									type: 'text',
									marks: [
										{
											type: 'highlight',
											attrs: {
												color: '#0000FF'
											}
										}
									],
									text: 'Integrals and differential'
								}
							]
						},
						{
							type: 'paragraph',
							attrs: {
								textAlign: null
							},
							content: [
								{
									type: 'inlineMath',
									attrs: {
										latex:
											'\\int_{0}^{\\frac{\\pi}{2}} \\sin(x) \\,dx = \\left[-\\cos(x)\\right]_0^{\\frac{\\pi}{2}} = -\\cos\\left(\\frac{\\pi}{2}\\right) + \\cos(0)',
										evaluate: 'no',
										display: 'no'
									}
								}
							]
						},
						{
							type: 'paragraph',
							attrs: {
								textAlign: null
							},
							content: [
								{
									type: 'inlineMath',
									attrs: {
										latex: '\\frac{\\mathrm{d}}{\\mathrm{d}x}(\\sin x) = \\cos x',
										evaluate: 'no',
										display: 'no'
									}
								}
							]
						}
					]
				}
			]
		},
		{
			type: 'paragraph',
			attrs: {
				textAlign: null
			}
		},
		{
			type: 'paragraph',
			attrs: {
				textAlign: null
			},
			content: [
				{
					type: 'text',
					text: 'Explore More…'
				}
			]
		},
		{
			type: 'paragraph',
			attrs: {
				textAlign: null
			}
		},
		{
			type: 'paragraph',
			attrs: {
				textAlign: null
			}
		},
		{
			type: 'paragraph',
			attrs: {
				textAlign: null
			}
		},
		{
			type: 'paragraph',
			attrs: {
				textAlign: null
			}
		},
		{
			type: 'paragraph',
			attrs: {
				textAlign: null
			}
		},
		{
			type: 'paragraph',
			attrs: {
				textAlign: null
			}
		},
		{
			type: 'paragraph',
			attrs: {
				textAlign: null
			}
		},
		{
			type: 'paragraph',
			attrs: {
				textAlign: null
			}
		},
		{
			type: 'paragraph',
			attrs: {
				textAlign: null
			}
		},
		{
			type: 'paragraph',
			attrs: {
				textAlign: null
			}
		},
		{
			type: 'paragraph',
			attrs: {
				textAlign: null
			}
		}
	]
};
